import { Product } from '../entities/product';
import { IOrderBumpProps } from '../entities/order-bump';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IOrderBumpDetailsProps extends IOrderBumpProps {
	id: UniqueEntityId;
	product: Product;
}

export class OrderBumpDetails extends ValueObject<IOrderBumpDetailsProps> {
	get id() {
		return this.props.id;
	}

	get productId() {
		return this.props.productId;
	}

	get marketCode() {
		return this.props.marketCode;
	}

	get name() {
		return this.props.name;
	}

	get description() {
		return this.props.description;
	}

	get unitAmount() {
		return this.props.unitAmount;
	}

	get quantity() {
		return this.props.quantity;
	}

	get isActive() {
		return this.props.isActive;
	}

	get sortOrder() {
		return this.props.sortOrder;
	}

	get product() {
		return this.props.product;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	static create(props: IOrderBumpDetailsProps) {
		const orderBump = new OrderBumpDetails(props);

		return orderBump;
	}
}
