import { Product } from '../entities/product';
import { OfferDetails } from './offer-details';
import { ICartItemProps } from '../entities/cart-item';
import { OrderBumpDetails } from './order-bump-details';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface ICartItemDetailsProps extends ICartItemProps {
	id: UniqueEntityId;
	product?: Product | null;
	offer?: OfferDetails | null;
	orderBump?: OrderBumpDetails | null;
}

export class CartItemDetails extends ValueObject<ICartItemDetailsProps> {
	get id() {
		return this.props.id;
	}

	get cartId() {
		return this.props.cartId;
	}

	get productId() {
		return this.props.productId;
	}

	get offerId() {
		return this.props.offerId;
	}

	get orderBumpId() {
		return this.props.orderBumpId;
	}

	get type() {
		return this.props.type;
	}

	get quantity() {
		return this.props.quantity;
	}

	get product() {
		return this.props.product;
	}

	get offer() {
		return this.props.offer;
	}

	get orderBump() {
		return this.props.orderBump;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	static create(props: ICartItemDetailsProps) {
		const item = new CartItemDetails(props);

		return item;
	}
}
