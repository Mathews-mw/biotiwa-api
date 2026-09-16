import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import type { IShippingProvider } from './shipping-quote-rate';
import type { ICurrencyCode } from '@/core/types/currency-code';

export interface IOrderShippingRateProps {
	orderId: UniqueEntityId;
	shippingQuoteId?: string | null;
	shippingQuoteRateId?: string | null;
	provider: IShippingProvider;
	serviceId: string;
	serviceName: string;
	carrierName?: string | null;
	amount: number;
	currency: ICurrencyCode;
	estimatedDays?: number | null;
	rawPayload?: unknown | null;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class OrderShippingRate extends Entity<IOrderShippingRateProps> {
	get orderId() {
		return this.props.orderId;
	}

	set orderId(orderId: UniqueEntityId) {
		this.props.orderId = orderId;
		this._touch();
	}

	get shippingQuoteId() {
		return this.props.shippingQuoteId;
	}

	set shippingQuoteId(shippingQuoteId: string | null | undefined) {
		this.props.shippingQuoteId = shippingQuoteId;
		this._touch();
	}

	get shippingQuoteRateId() {
		return this.props.shippingQuoteRateId;
	}

	set shippingQuoteRateId(shippingQuoteRateId: string | null | undefined) {
		this.props.shippingQuoteRateId = shippingQuoteRateId;
		this._touch();
	}

	get provider() {
		return this.props.provider;
	}

	set provider(provider: IShippingProvider) {
		this.props.provider = provider;
		this._touch();
	}

	get serviceId() {
		return this.props.serviceId;
	}

	set serviceId(serviceId: string) {
		this.props.serviceId = serviceId;
		this._touch();
	}

	get serviceName() {
		return this.props.serviceName;
	}

	set serviceName(serviceName: string) {
		this.props.serviceName = serviceName;
		this._touch();
	}

	get carrierName() {
		return this.props.carrierName;
	}

	set carrierName(carrierName: string | null | undefined) {
		this.props.carrierName = carrierName;
		this._touch();
	}

	get amount() {
		return this.props.amount;
	}

	set amount(amount: number) {
		this.props.amount = amount;
		this._touch();
	}

	get currency() {
		return this.props.currency;
	}

	set currency(currency: ICurrencyCode) {
		this.props.currency = currency;
		this._touch();
	}

	get estimatedDays() {
		return this.props.estimatedDays;
	}

	set estimatedDays(estimatedDays: number | null | undefined) {
		this.props.estimatedDays = estimatedDays;
		this._touch();
	}

	get rawPayload() {
		return this.props.rawPayload;
	}

	set rawPayload(rawPayload: unknown | null | undefined) {
		this.props.rawPayload = rawPayload;
		this._touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	private _touch() {
		this.props.updatedAt = new Date();
	}

	static create(
		props: Optional<
			IOrderShippingRateProps,
			'shippingQuoteId' | 'shippingQuoteRateId' | 'carrierName' | 'estimatedDays' | 'rawPayload' | 'createdAt'
		>,
		id?: UniqueEntityId
	) {
		return new OrderShippingRate(
			{
				...props,
				shippingQuoteId: props.shippingQuoteId ?? null,
				shippingQuoteRateId: props.shippingQuoteRateId ?? null,
				carrierName: props.carrierName ?? null,
				estimatedDays: props.estimatedDays ?? null,
				rawPayload: props.rawPayload ?? null,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);
	}
}
