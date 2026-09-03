import type { IOrderProps, Order } from '../entities/order';

import { OrderItemDetails } from './order-item-details';
import { ValueObject } from '@/core/entities/value-object';
import { OrderCustomer } from '../entities/order-customer';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OrderShippingAddress } from '../entities/order-shipping-address';

export interface IOrderDetailsProps extends IOrderProps {
	order: Order;
	id: UniqueEntityId;
	orderCustomer?: OrderCustomer | null;
	orderShippingAddress?: OrderShippingAddress | null;
	items: Array<OrderItemDetails>;
}

export class OrderDetails extends ValueObject<IOrderDetailsProps> {
	get order() {
		return this.props.order;
	}

	get id() {
		return this.props.id;
	}

	get userId() {
		return this.props.userId;
	}

	get cartId() {
		return this.props.cartId;
	}

	get marketCode() {
		return this.props.marketCode;
	}

	get currency() {
		return this.props.currency;
	}

	get status() {
		return this.props.status;
	}

	get itemsAmount() {
		return this.props.itemsAmount;
	}

	get orderBumpAmount() {
		return this.props.orderBumpAmount;
	}

	get subtotalAmount() {
		return this.props.subtotalAmount;
	}

	get discountAmount() {
		return this.props.discountAmount;
	}

	get taxAmount() {
		return this.props.taxAmount;
	}

	get shippingAmount() {
		return this.props.shippingAmount;
	}

	get totalAmount() {
		return this.props.totalAmount;
	}

	get expiresAt() {
		return this.props.expiresAt;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get orderCustomer() {
		return this.props.orderCustomer;
	}

	get orderShippingAddress() {
		return this.props.orderShippingAddress;
	}

	get items() {
		return this.props.items;
	}

	static create(props: IOrderDetailsProps) {
		const order = new OrderDetails(props);

		return order;
	}
}
