import z from 'zod';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const cartItemTypeSchema = z.enum(['OFFER', 'PRODUCT', 'ORDER_BUMP']);

export type ICartItemType = z.infer<typeof cartItemTypeSchema>;

export interface ICartItemProps {
	cartId: UniqueEntityId;
	productId?: UniqueEntityId | null;
	offerId?: UniqueEntityId | null;
	orderBumpId?: UniqueEntityId | null;
	type: ICartItemType;
	quantity: number;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class CartItem extends Entity<ICartItemProps> {
	get cartId() {
		return this.props.cartId;
	}

	set cartId(cartId: UniqueEntityId) {
		this.props.cartId = cartId;
		this._touch();
	}

	get productId() {
		return this.props.productId;
	}

	set productId(productId: UniqueEntityId | undefined | null) {
		this.props.productId = productId;
		this._touch();
	}

	get offerId() {
		return this.props.offerId;
	}

	set offerId(offerId: UniqueEntityId | undefined | null) {
		this.props.offerId = offerId;
		this._touch();
	}

	get orderBumpId() {
		return this.props.orderBumpId;
	}

	set orderBumpId(orderBumpId: UniqueEntityId | undefined | null) {
		this.props.orderBumpId = orderBumpId;
		this._touch();
	}

	get type() {
		return this.props.type;
	}

	set type(type: ICartItemType) {
		this.props.type = type;
		this._touch();
	}

	get quantity() {
		return this.props.quantity;
	}

	set quantity(quantity: number) {
		this.props.quantity = quantity;
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

	static create(props: Optional<ICartItemProps, 'quantity' | 'createdAt'>, id?: UniqueEntityId) {
		const cartItem = new CartItem(
			{
				...props,
				quantity: props.quantity ?? 1,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return cartItem;
	}
}
