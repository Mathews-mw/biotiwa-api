import { ProductDetails } from './product-details';
import { IOfferItemProps } from '../entities/offer-item';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IOfferItemDetailsProps extends IOfferItemProps {
	id: UniqueEntityId;
	product: ProductDetails;
}

export class OfferItemDetails extends ValueObject<IOfferItemDetailsProps> {
	get id() {
		return this.props.id;
	}

	get offerId() {
		return this.props.offerId;
	}

	get productId() {
		return this.props.productId;
	}

	get quantity() {
		return this.props.quantity;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get product() {
		return this.props.product;
	}

	static create(props: IOfferItemDetailsProps) {
		const item = new OfferItemDetails(props);

		return item;
	}
}
