import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import type { IMarketCode } from '@/core/types/market-code';
import z from 'zod';

export const shippingQuoteStatusSchema = z.enum(['ACTIVE', 'SELECTED', 'EXPIRED']);
export type IShippingQuoteStatus = z.infer<typeof shippingQuoteStatusSchema>;

export interface IShippingQuoteProps {
	userId: UniqueEntityId;
	cartId: UniqueEntityId;
	marketCode: IMarketCode;
	destinationPostalCode: string;
	cartFingerprint: string;
	status: IShippingQuoteStatus;
	expiresAt: Date;
	requestPayload?: unknown | null;
	responsePayload?: unknown | null;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class ShippingQuote extends Entity<IShippingQuoteProps> {
	get userId() {
		return this.props.userId;
	}

	set userId(userId: UniqueEntityId) {
		this.props.userId = userId;
		this._touch();
	}

	get cartId() {
		return this.props.cartId;
	}

	set cartId(cartId: UniqueEntityId) {
		this.props.cartId = cartId;
		this._touch();
	}

	get marketCode() {
		return this.props.marketCode;
	}

	set marketCode(marketCode: IMarketCode) {
		this.props.marketCode = marketCode;
		this._touch();
	}

	get destinationPostalCode() {
		return this.props.destinationPostalCode;
	}

	set destinationPostalCode(destinationPostalCode: string) {
		this.props.destinationPostalCode = destinationPostalCode;
		this._touch();
	}

	get cartFingerprint() {
		return this.props.cartFingerprint;
	}

	set cartFingerprint(cartFingerprint: string) {
		this.props.cartFingerprint = cartFingerprint;
		this._touch();
	}

	get status() {
		return this.props.status;
	}

	set status(status: IShippingQuoteStatus) {
		this.props.status = status;
		this._touch();
	}

	get expiresAt() {
		return this.props.expiresAt;
	}

	set expiresAt(expiresAt: Date) {
		this.props.expiresAt = expiresAt;
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

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get isExpired() {
		return this.props.expiresAt.getTime() <= Date.now();
	}

	private _touch() {
		this.props.updatedAt = new Date();
	}

	static create(
		props: Optional<IShippingQuoteProps, 'status' | 'requestPayload' | 'responsePayload' | 'createdAt'>,
		id?: UniqueEntityId
	) {
		return new ShippingQuote(
			{
				...props,
				status: props.status ?? 'ACTIVE',
				requestPayload: props.requestPayload ?? null,
				responsePayload: props.responsePayload ?? null,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);
	}
}
