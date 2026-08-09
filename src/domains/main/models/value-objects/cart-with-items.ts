import { CartItem } from '../entities/cart-item';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import type { ICartProps } from '../entities/cart';

export interface ICartWithItemsProps extends ICartProps {
	id: UniqueEntityId;
	items: Array<CartItem>;
}

export class CartWithItems extends ValueObject<ICartWithItemsProps> {
	get id() {
		return this.props.id;
	}

	get userId() {
		return this.props.userId;
	}

	get marketCode() {
		return this.props.marketCode;
	}

	get status() {
		return this.props.status;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get items() {
		return this.props.items;
	}

	static create(props: ICartWithItemsProps) {
		const entity = new CartWithItems(props);

		return entity;
	}
}
