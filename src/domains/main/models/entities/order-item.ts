import z from 'zod';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const orderItemTypeSchema = z.enum(['OFFER_ITEM', 'PRODUCT', 'ORDER_BUMP']);

export type IOrderItemType = z.infer<typeof orderItemTypeSchema>;

export interface IOrderItemProps {
	orderId: UniqueEntityId;
	productId?: UniqueEntityId | null;
	type: IOrderItemType;
	name: string;
	sku: string;
	quantity: number;
	unitAmount: number;
	totalAmount: number;
	metadata?: Record<string, unknown> | null;
	createdAt: Date;
}

export class OrderItem extends Entity<IOrderItemProps> {
	get orderId() {
		return this.props.orderId;
	}

	set orderId(orderId: UniqueEntityId) {
		this.props.orderId = orderId;
	}

	get productId() {
		return this.props.productId;
	}

	set productId(productId: UniqueEntityId | null | undefined) {
		this.props.productId = productId;
	}

	get type() {
		return this.props.type;
	}

	set type(type: IOrderItemType) {
		this.props.type = type;
	}

	get name() {
		return this.props.name;
	}

	set name(name: string) {
		this.props.name = name;
	}

	get sku() {
		return this.props.sku;
	}

	set sku(sku: string) {
		this.props.sku = sku;
	}

	get quantity() {
		return this.props.quantity;
	}

	set quantity(quantity: number) {
		this.props.quantity = quantity;
	}

	get unitAmount() {
		return this.props.unitAmount;
	}

	set unitAmount(unitAmount: number) {
		this.props.unitAmount = unitAmount;
	}

	get totalAmount() {
		return this.props.totalAmount;
	}

	set totalAmount(totalAmount: number) {
		this.props.totalAmount = totalAmount;
	}

	get metadata() {
		return this.props.metadata;
	}

	set metadata(metadata: Record<string, unknown> | null | undefined) {
		this.props.metadata = metadata;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	set createdAt(createdAt: Date) {
		this.props.createdAt = createdAt;
	}

	static create(props: Optional<IOrderItemProps, 'createdAt'>, id?: UniqueEntityId) {
		const orderItem = new OrderItem(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return orderItem;
	}
}
