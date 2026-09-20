import z from 'zod';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { IMarketCode } from '@/core/types/market-code';
import { ICurrencyCode } from '@/core/types/currency-code';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import checkoutConfig from '@/domains/main/application/modules/checkout/config/checkout-config';

export const orderStatusSchema = z.enum([
	'PENDING_PAYMENT',
	'PAID',
	'PROCESSING',
	'SHIPPED',
	'DELIVERED',
	'CANCELED',
	'REFUNDED',
	'PAYMENT_FAILED',
	'EXPIRED',
]);

export type IOrderStatus = z.infer<typeof orderStatusSchema>;

export interface IOrderProps {
	userId: UniqueEntityId;
	cartId?: UniqueEntityId | null;
	marketCode: IMarketCode;
	currency: ICurrencyCode;
	status: IOrderStatus;
	itemsAmount: number;
	orderBumpAmount: number;
	subtotalAmount: number;
	discountAmount: number;
	taxAmount: number;
	shippingAmount: number;
	totalAmount: number;
	expiresAt?: Date | null;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Order extends Entity<IOrderProps> {
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

	set cartId(cartId: UniqueEntityId | null | undefined) {
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

	get currency() {
		return this.props.currency;
	}

	set currency(currency: ICurrencyCode) {
		this.props.currency = currency;
		this._touch();
	}

	get status() {
		return this.props.status;
	}

	set status(status: IOrderStatus) {
		this.props.status = status;
		this._touch();
	}

	get itemsAmount() {
		return this.props.itemsAmount;
	}

	set itemsAmount(itemsAmount: number) {
		this.props.itemsAmount = itemsAmount;
		this._touch();
	}

	get orderBumpAmount() {
		return this.props.orderBumpAmount;
	}

	set orderBumpAmount(orderBumpAmount: number) {
		this.props.orderBumpAmount = orderBumpAmount;
		this._touch();
	}

	get subtotalAmount() {
		return this.props.subtotalAmount;
	}

	set subtotalAmount(subtotalAmount: number) {
		this.props.subtotalAmount = subtotalAmount;
		this._touch();
	}

	get discountAmount() {
		return this.props.discountAmount;
	}

	set discountAmount(discountAmount: number) {
		this.props.discountAmount = discountAmount;
		this._touch();
	}

	get taxAmount() {
		return this.props.taxAmount;
	}

	set taxAmount(taxAmount: number) {
		this.props.taxAmount = taxAmount;
		this._touch();
	}

	get shippingAmount() {
		return this.props.shippingAmount;
	}

	set shippingAmount(shippingAmount: number) {
		this.props.shippingAmount = shippingAmount;
		this._touch();
	}

	get totalAmount() {
		return this.props.totalAmount;
	}

	set totalAmount(totalAmount: number) {
		this.props.totalAmount = totalAmount;
		this._touch();
	}

	get expiresAt() {
		return this.props.expiresAt;
	}

	set expiresAt(expiresAt: Date | null | undefined) {
		this.props.expiresAt = expiresAt;
		this._touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	set createdAt(createdAt: Date) {
		this.props.createdAt = createdAt;
		this._touch();
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	private _touch() {
		this.props.updatedAt = new Date();
	}

	markAsPaid() {
		if (this.props.status === 'PAID') {
			return;
		}

		this.props.status = 'PAID';
		this._touch();
	}

	markAsPaymentFailed() {
		if (this.props.status === 'PAID') {
			return;
		}

		this.props.status = 'PAYMENT_FAILED';
		this._touch();
	}

	markAsExpired() {
		if (this.props.status === 'PAID') {
			return;
		}

		this.props.status = 'EXPIRED';
		this._touch();
	}

	markAsProcessing() {
		if (this.props.status === 'PROCESSING') {
			return;
		}

		if (this.props.status !== 'PAID') {
			return;
		}

		this.props.status = 'PROCESSING';
		this._touch();
	}

	static create(props: Optional<IOrderProps, 'status' | 'createdAt' | 'expiresAt'>, id?: UniqueEntityId) {
		const now = new Date();

		const order = new Order(
			{
				...props,
				status: props.status ?? 'PENDING_PAYMENT',
				createdAt: props.createdAt ?? now,
				expiresAt: props.expiresAt ?? new Date(now.getTime() + checkoutConfig.ORDER_EXPIRES_AT_IN_MS),
			},
			id
		);

		return order;
	}
}
