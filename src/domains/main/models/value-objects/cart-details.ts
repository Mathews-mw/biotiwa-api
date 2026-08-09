import { User } from '../entities/user';
import { Market } from '../entities/market';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import type { ICartProps } from '../entities/cart';
import { CartItemDetails } from './cart-item-details';

export interface ICartDetailsProps extends ICartProps {
	id: UniqueEntityId;
	user: User;
	market: Market;
	items: Array<CartItemDetails>;
}

export class CartDetails extends ValueObject<ICartDetailsProps> {
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

	get user() {
		return this.props.user;
	}

	get market() {
		return this.props.market;
	}

	get items() {
		return this.props.items;
	}

	static create(props: ICartDetailsProps) {
		const item = new CartDetails(props);

		return item;
	}
}
