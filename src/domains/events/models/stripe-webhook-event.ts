import z from 'zod';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const stripeWebhookEventStatusSchema = z.enum(['PROCESSING', 'PROCESSED', 'FAILED']);

export type IStripeWebhookEventStatus = z.infer<typeof stripeWebhookEventStatusSchema>;

export interface IStripeWebhookEventProps {
	providerEventId: string;
	providerObjectId?: string | null;
	eventType: string;
	status: IStripeWebhookEventStatus;
	errorMessage?: string | null;
	processedAt?: Date | null;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class StripeWebhookEvent extends Entity<IStripeWebhookEventProps> {
	get providerEventId() {
		return this.props.providerEventId;
	}

	set providerEventId(providerEventId: string) {
		this.providerEventId = providerEventId;
		this._touch();
	}

	get providerObjectId() {
		return this.props.providerObjectId;
	}

	set providerObjectId(providerObjectId: string | null | undefined) {
		this.providerObjectId = providerObjectId;
		this._touch();
	}

	get eventType() {
		return this.props.eventType;
	}

	set eventType(eventType: string) {
		this.eventType = eventType;
		this._touch();
	}

	get status() {
		return this.props.status;
	}

	set status(status: IStripeWebhookEventStatus) {
		this.status = status;
		this._touch();
	}

	get errorMessage() {
		return this.props.errorMessage;
	}

	set errorMessage(errorMessage: string | null | undefined) {
		this.errorMessage = errorMessage;
		this._touch();
	}

	get processedAt() {
		return this.props.processedAt;
	}

	set processedAt(processedAt: Date | null | undefined) {
		this.processedAt = processedAt;
		this._touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get isProcessed() {
		return this.props.status === 'PROCESSED';
		this._touch();
	}

	get isProcessing() {
		return this.props.status === 'PROCESSING';
		this._touch();
	}

	get hasFailed() {
		return this.props.status === 'FAILED';
		this._touch();
	}

	private _touch() {
		this._touch();
	}

	markAsProcessing() {
		this.props.status = 'PROCESSING';
		this.props.errorMessage = null;
		this._touch();
	}

	markAsProcessed() {
		const now = new Date();

		this.props.status = 'PROCESSED';
		this.props.processedAt = now;
		this.props.errorMessage = null;
		this.props.updatedAt = now;
	}

	markAsFailed(errorMessage: string) {
		this.props.status = 'FAILED';
		this.props.errorMessage = errorMessage;
		this._touch();
	}

	static create(
		props: Optional<IStripeWebhookEventProps, 'status' | 'errorMessage' | 'processedAt' | 'createdAt'>,
		id?: UniqueEntityId
	) {
		const stripeWebhookEvent = new StripeWebhookEvent(
			{
				...props,
				status: props.status ?? 'PROCESSING',
				errorMessage: props.errorMessage ?? null,
				processedAt: props.processedAt ?? null,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return stripeWebhookEvent;
	}
}
