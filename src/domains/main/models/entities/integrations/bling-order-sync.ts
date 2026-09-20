// src/domains/main/models/entities/bling-order-sync.ts

import z from 'zod';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const blingOrderSyncStatusSchema = z.enum(['PENDING', 'PROCESSING', 'SYNCED', 'FAILED']);

export type IBlingOrderSyncStatus = z.infer<typeof blingOrderSyncStatusSchema>;

export interface IBlingOrderSyncProps {
	orderId: UniqueEntityId;
	status: IBlingOrderSyncStatus;
	blingContactId?: string | null;
	blingOrderId?: string | null;
	attempts: number;
	lastErrorMessage?: string | null;
	requestPayload?: unknown | null;
	responsePayload?: unknown | null;
	syncedAt?: Date | null;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class BlingOrderSync extends Entity<IBlingOrderSyncProps> {
	get orderId() {
		return this.props.orderId;
	}

	set orderId(orderId: UniqueEntityId) {
		this.props.orderId = orderId;
	}

	get status() {
		return this.props.status;
	}

	set status(status: IBlingOrderSyncStatus) {
		this.props.status = status;
		this._touch();
	}

	get blingContactId() {
		return this.props.blingContactId;
	}

	set blingContactId(blingContactId: string | null | undefined) {
		this.props.blingContactId = blingContactId;
		this._touch();
	}

	get blingOrderId() {
		return this.props.blingOrderId;
	}

	set blingOrderId(blingOrderId: string | null | undefined) {
		this.props.blingOrderId = blingOrderId;
		this._touch();
	}

	get attempts() {
		return this.props.attempts;
	}

	set attempts(attempts: number) {
		this.props.attempts = attempts;
		this._touch();
	}

	get lastErrorMessage() {
		return this.props.lastErrorMessage;
	}

	set lastErrorMessage(lastErrorMessage: string | null | undefined) {
		this.props.lastErrorMessage = lastErrorMessage;
		this._touch();
	}

	get requestPayload() {
		return this.props.requestPayload;
	}

	set requestPayload(requestPayload: unknown | null | undefined) {
		this.props.requestPayload = requestPayload;
		this._touch();
	}

	get responsePayload() {
		return this.props.responsePayload;
	}

	set responsePayload(responsePayload: unknown | null | undefined) {
		this.props.responsePayload = responsePayload;
		this._touch();
	}

	get syncedAt() {
		return this.props.syncedAt;
	}

	set syncedAt(syncedAt: Date | null | undefined) {
		this.props.syncedAt = syncedAt;
		this._touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	set createdAt(createdAt: Date) {
		this.props.createdAt = createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get isSynced() {
		return this.props.status === 'SYNCED';
	}

	get isPending() {
		return this.props.status === 'PENDING';
	}

	get hasFailed() {
		return this.props.status === 'FAILED';
	}

	markAsProcessing() {
		if (this.isSynced) {
			return;
		}

		this.props.status = 'PROCESSING';
		this.props.attempts += 1;
		this.props.lastErrorMessage = null;
		this._touch();
	}

	markAsSynced(input: {
		blingContactId?: string | number | null;
		blingOrderId: string | number;
		requestPayload?: unknown | null;
		responsePayload?: unknown | null;
	}) {
		this.props.status = 'SYNCED';
		this.props.blingContactId =
			input.blingContactId !== undefined && input.blingContactId !== null
				? String(input.blingContactId)
				: this.props.blingContactId;
		this.props.blingOrderId = String(input.blingOrderId);
		this.props.requestPayload = input.requestPayload ?? this.props.requestPayload;
		this.props.responsePayload = input.responsePayload ?? this.props.responsePayload;
		this.props.lastErrorMessage = null;
		this.props.syncedAt = new Date();
		this._touch();
	}

	markAsFailed(input: { errorMessage: string; requestPayload?: unknown | null; responsePayload?: unknown | null }) {
		if (this.isSynced) {
			return;
		}

		this.props.status = 'FAILED';
		this.props.lastErrorMessage = input.errorMessage;
		this.props.requestPayload = input.requestPayload ?? this.props.requestPayload;
		this.props.responsePayload = input.responsePayload ?? this.props.responsePayload;
		this._touch();
	}

	markAsPending() {
		if (this.isSynced) {
			return;
		}

		this.props.status = 'PENDING';
		this.props.lastErrorMessage = null;
		this._touch();
	}

	setBlingContactId(blingContactId: string | number) {
		if (this.isSynced) {
			return;
		}

		this.props.blingContactId = String(blingContactId);
		this._touch();
	}

	private _touch() {
		this.props.updatedAt = new Date();
	}

	static create(
		props: Optional<
			IBlingOrderSyncProps,
			| 'status'
			| 'attempts'
			| 'blingContactId'
			| 'blingOrderId'
			| 'lastErrorMessage'
			| 'requestPayload'
			| 'responsePayload'
			| 'syncedAt'
			| 'createdAt'
		>,
		id?: UniqueEntityId
	) {
		return new BlingOrderSync(
			{
				...props,
				status: props.status ?? 'PENDING',
				attempts: props.attempts ?? 0,
				blingContactId: props.blingContactId ?? null,
				blingOrderId: props.blingOrderId ?? null,
				lastErrorMessage: props.lastErrorMessage ?? null,
				requestPayload: props.requestPayload ?? null,
				responsePayload: props.responsePayload ?? null,
				syncedAt: props.syncedAt ?? null,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);
	}
}
