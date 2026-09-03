import { prisma } from '@/infra/database/prisma';
import { Prisma } from '@/generated/prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { StripeWebhookEvent } from '@/domains/events/models/stripe-webhook-event';

import type {
	IStartStripeWebhookEventProcessingResult,
	IStripeWebhookEventRepository,
} from '@/domains/events/application/modules/stripe/repositories/stripe-webhook-event-repository';
import paymentConfig from '@/config/payment-config';

type PrismaStripeWebhookEvent = {
	id: string;
	providerEventId: string;
	providerObjectId: string | null;
	eventType: string;
	status: 'PROCESSING' | 'PROCESSED' | 'FAILED';
	errorMessage: string | null;
	processedAt: Date | null;
	createdAt: Date;
	updatedAt: Date | null;
};

export class PrismaStripeWebhookEventRepository implements IStripeWebhookEventRepository {
	async startProcessing(event: StripeWebhookEvent): Promise<IStartStripeWebhookEventProcessingResult> {
		try {
			const createdEvent = await prisma.stripeWebhookEvent.create({
				data: {
					id: event.id.toString(),
					providerEventId: event.providerEventId,
					providerObjectId: event.providerObjectId ?? null,
					eventType: event.eventType,
					status: 'PROCESSING',
					errorMessage: event.errorMessage,
					processedAt: event.processedAt,
					createdAt: event.createdAt,
					updatedAt: event.updatedAt,
				},
			});

			return {
				event: mapPrismaStripeWebhookEventToDomain(createdEvent),
				shouldProcess: true,
			};
		} catch (error) {
			if (!isUniqueConstraintError(error)) {
				throw error;
			}

			const existingEvent = await this.findByProviderEventId(event.providerEventId);
			console.log('existingEvent: ', existingEvent);

			if (!existingEvent) {
				throw error;
			}

			if (existingEvent.isProcessed) {
				return {
					event: existingEvent,
					shouldProcess: false,
				};
			}

			if (existingEvent.isProcessing && !existingEvent.isProcessingStale()) {
				return {
					event: existingEvent,
					shouldProcess: false,
				};
			}

			if (existingEvent.isProcessing && existingEvent.isProcessingStale()) {
				const staleCutoff = new Date(Date.now() - paymentConfig.PROCESSING_STALE_AFTER_IN_MS);

				const claimed = await prisma.stripeWebhookEvent.updateMany({
					where: {
						providerEventId: event.providerEventId,
						status: 'PROCESSING',
						updatedAt: {
							lte: staleCutoff,
						},
					},
					data: {
						errorMessage: null,
						updatedAt: new Date(),
					},
				});

				const refreshedEvent = await this.findByProviderEventId(event.providerEventId);

				if (!refreshedEvent) {
					throw error;
				}

				return {
					event: refreshedEvent,
					shouldProcess: claimed.count === 1,
				};
			}

			if (existingEvent.hasFailed) {
				existingEvent.markAsProcessing();

				const updatedEvent = await this.save(existingEvent);

				return {
					event: updatedEvent,
					shouldProcess: true,
				};
			}

			return {
				event: existingEvent,
				shouldProcess: true,
			};
		}
	}

	async findByProviderEventId(providerEventId: string): Promise<StripeWebhookEvent | null> {
		const event = await prisma.stripeWebhookEvent.findUnique({
			where: {
				providerEventId,
			},
		});

		return event ? mapPrismaStripeWebhookEventToDomain(event) : null;
	}

	async save(event: StripeWebhookEvent): Promise<StripeWebhookEvent> {
		const result = await prisma.stripeWebhookEvent.update({
			where: {
				providerEventId: event.providerEventId,
			},
			data: {
				providerObjectId: event.providerObjectId ?? null,
				eventType: event.eventType,
				status: event.status,
				errorMessage: event.errorMessage,
				processedAt: event.processedAt,
				updatedAt: event.updatedAt,
			},
		});

		return mapPrismaStripeWebhookEventToDomain(result);
	}
}

function mapPrismaStripeWebhookEventToDomain(event: PrismaStripeWebhookEvent) {
	return StripeWebhookEvent.create(
		{
			providerEventId: event.providerEventId,
			providerObjectId: event.providerObjectId,
			eventType: event.eventType,
			status: event.status,
			errorMessage: event.errorMessage,
			processedAt: event.processedAt,
			createdAt: event.createdAt,
			updatedAt: event.updatedAt,
		},
		new UniqueEntityId(event.id)
	);
}

function isUniqueConstraintError(error: unknown) {
	return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}
