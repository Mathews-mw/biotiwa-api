import { prisma } from '@/infra/database/prisma';
import { Prisma } from '@/generated/prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { StripeWebhookEvent } from '@/domains/events/models/stripe-webhook-event';

import type {
	IStartStripeWebhookEventProcessingResult,
	IStripeWebhookEventRepository,
} from '@/domains/events/application/modules/stripe/repositories/stripe-webhook-event-repository';

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
					status: event.status,
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
			if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
				throw error;
			}

			const existingEvent = await this.findByProviderEventId(event.providerEventId);

			if (!existingEvent) {
				throw error;
			}

			if (existingEvent.isProcessed || existingEvent.isProcessing) {
				return {
					event: existingEvent,
					shouldProcess: false,
				};
			}

			existingEvent.markAsProcessing();

			await this.save(existingEvent);

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

	async save(event: StripeWebhookEvent): Promise<void> {
		await prisma.stripeWebhookEvent.update({
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
