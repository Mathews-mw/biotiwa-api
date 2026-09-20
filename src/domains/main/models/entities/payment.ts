import z from 'zod';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { ICurrencyCode } from '@/core/types/currency-code';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const paymentProviderSchema = z.enum(['STRIPE']);
export const paymentStatusSchema = z.enum(['PENDING', 'PAID', 'FAILED', 'CANCELED', 'EXPIRED', 'REFUNDED']);
export const paymentTypeSchema = z.enum(['BEING_DEFINED', 'PIX', 'CREDIT', 'DEBIT', 'PAYMENT_SLIPS_OR_SIMILAR']);

export type IPaymentProvider = z.infer<typeof paymentProviderSchema>;
export type IPaymentStatus = z.infer<typeof paymentStatusSchema>;
export type IPaymentType = z.infer<typeof paymentTypeSchema>;

export interface IPaymentProps {
	orderId: UniqueEntityId;
	provider: IPaymentProvider;
	status: IPaymentStatus;
	amount: number;
	currency: ICurrencyCode;
	paymentType: IPaymentType;
	providerSessionId?: string | null;
	providerPaymentIntent?: string | null;
	providerCheckoutUrl?: string | null;
	rawPayload?: unknown | null;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Payment extends Entity<IPaymentProps> {
	get orderId() {
		return this.props.orderId;
	}

	set orderId(orderId: UniqueEntityId) {
		this.props.orderId = orderId;
		this._touch();
	}

	get provider() {
		return this.props.provider;
	}

	set provider(provider: IPaymentProvider) {
		this.props.provider = provider;
		this._touch();
	}

	get status() {
		return this.props.status;
	}

	set status(status: IPaymentStatus) {
		this.props.status = status;
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

	get paymentType() {
		return this.props.paymentType;
	}

	set paymentType(paymentType: IPaymentType) {
		this.props.paymentType = paymentType;
		this._touch();
	}

	get providerSessionId() {
		return this.props.providerSessionId;
	}

	set providerSessionId(providerSessionId: string | null | undefined) {
		this.props.providerSessionId = providerSessionId;
		this._touch();
	}

	get providerPaymentIntent() {
		return this.props.providerPaymentIntent;
	}

	set providerPaymentIntent(providerPaymentIntent: string | null | undefined) {
		this.props.providerPaymentIntent = providerPaymentIntent;
		this._touch();
	}

	get providerCheckoutUrl() {
		return this.props.providerCheckoutUrl;
	}

	set providerCheckoutUrl(providerCheckoutUrl: string | null | undefined) {
		this.props.providerCheckoutUrl = providerCheckoutUrl;
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

	set createdAt(createdAt: Date) {
		this.props.createdAt = createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get isPaid() {
		return this.props.status === 'PAID';
	}

	markAsPaid(input: { providerPaymentIntent?: string | null; rawPayload?: unknown | null }) {
		this.props.status = 'PAID';
		this.props.providerPaymentIntent = input.providerPaymentIntent ?? this.props.providerPaymentIntent;
		this.props.rawPayload = input.rawPayload ?? this.props.rawPayload;
		this._touch();
	}

	markAsFailed(input?: { rawPayload?: unknown | null }) {
		if (this.props.status === 'PAID') {
			return;
		}

		this.props.status = 'FAILED';
		this.props.rawPayload = input?.rawPayload ?? this.props.rawPayload;
		this._touch();
	}

	markAsExpired(input?: { rawPayload?: unknown | null }) {
		if (this.props.status === 'PAID') {
			return;
		}

		this.props.status = 'EXPIRED';
		this.props.rawPayload = input?.rawPayload ?? this.props.rawPayload;
		this._touch();
	}

	private _touch() {
		this.props.updatedAt = new Date();
	}

	static create(props: Optional<IPaymentProps, 'status' | 'paymentType' | 'createdAt'>, id?: UniqueEntityId) {
		const payment = new Payment(
			{
				...props,
				status: props.status ?? 'PENDING',
				paymentType: props.paymentType ?? 'BEING_DEFINED',
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return payment;
	}
}
