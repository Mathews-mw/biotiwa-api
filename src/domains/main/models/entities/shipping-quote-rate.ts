import z from 'zod';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import type { ICurrencyCode } from '@/core/types/currency-code';

export const shippingProviderSchema = z.enum(['MELHOR_ENVIO']);
export type IShippingProvider = z.infer<typeof shippingProviderSchema>;

export interface IShippingQuoteRateProps {
	shippingQuoteId: UniqueEntityId;
	provider: IShippingProvider;
	serviceId: string;
	serviceName: string;
	carrierName?: string | null;
	amount: number;
	currency: ICurrencyCode;
	estimatedDays?: number | null;
	rawPayload?: unknown | null;
	createdAt: Date;
}

export class ShippingQuoteRate extends Entity<IShippingQuoteRateProps> {
	get shippingQuoteId() {
		return this.props.shippingQuoteId;
	}

	set shippingQuoteId(shippingQuoteId: UniqueEntityId) {
		this.props.shippingQuoteId = shippingQuoteId;
	}

	get provider() {
		return this.props.provider;
	}

	set provider(provider: IShippingProvider) {
		this.props.provider = provider;
	}

	get serviceId() {
		return this.props.serviceId;
	}

	set serviceId(serviceId: string) {
		this.props.serviceId = serviceId;
	}

	get serviceName() {
		return this.props.serviceName;
	}

	set serviceName(serviceName: string) {
		this.props.serviceName = serviceName;
	}

	get carrierName() {
		return this.props.carrierName;
	}

	set carrierName(carrierName: string | null | undefined) {
		this.props.carrierName = carrierName;
	}

	get amount() {
		return this.props.amount;
	}

	set amount(amount: number) {
		this.props.amount = amount;
	}

	get currency() {
		return this.props.currency;
	}

	set currency(currency: ICurrencyCode) {
		this.props.currency = currency;
	}

	get estimatedDays() {
		return this.props.estimatedDays;
	}

	set estimatedDays(estimatedDays: number | null | undefined) {
		this.props.estimatedDays = estimatedDays;
	}

	get rawPayload() {
		return this.props.rawPayload;
	}

	set rawPayload(rawPayload: unknown | null | undefined) {
		this.props.rawPayload = rawPayload;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	static create(
		props: Optional<IShippingQuoteRateProps, 'carrierName' | 'estimatedDays' | 'rawPayload' | 'createdAt'>,
		id?: UniqueEntityId
	) {
		return new ShippingQuoteRate(
			{
				...props,
				carrierName: props.carrierName ?? null,
				estimatedDays: props.estimatedDays ?? null,
				rawPayload: props.rawPayload ?? null,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);
	}
}
