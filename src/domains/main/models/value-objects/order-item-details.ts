import { Product } from '../entities/product';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { IOrderItemProps, OrderItem } from '../entities/order-item';

export interface IOrderItemDetailsProps extends IOrderItemProps {
	orderItem: OrderItem;
	id: UniqueEntityId;
	product?: Product | null;
}

export class OrderItemDetails extends ValueObject<IOrderItemDetailsProps> {
	get orderItem() {
		return this.props.orderItem;
	}

	get id() {
		return this.props.id;
	}

	get orderId() {
		return this.props.orderId;
	}

	get productId() {
		return this.props.productId;
	}

	get type() {
		return this.props.type;
	}

	get name() {
		return this.props.name;
	}

	get sku() {
		return this.props.sku;
	}

	get quantity() {
		return this.props.quantity;
	}

	get unitAmount() {
		return this.props.unitAmount;
	}

	get totalAmount() {
		return this.props.totalAmount;
	}

	get metadata() {
		return this.props.metadata;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get product() {
		return this.props.product;
	}

	static create(props: IOrderItemDetailsProps) {
		const orderItem = new OrderItemDetails(props);

		return orderItem;
	}
}
