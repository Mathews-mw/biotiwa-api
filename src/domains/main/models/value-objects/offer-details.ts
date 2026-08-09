import { IOfferProps } from '../entities/offer';
import { OfferItemDetails } from './offer-item-details';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IOfferDetailsProps extends IOfferProps {
	id: UniqueEntityId;
	items: Array<OfferItemDetails>;
}

export class OfferDetails extends ValueObject<IOfferDetailsProps> {
	get id() {
		return this.props.id;
	}

	get slug() {
		return this.props.slug;
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

	get discountPercent() {
		return this.props.discountPercent;
	}

	get isHighlighted() {
		return this.props.isHighlighted;
	}

	get status() {
		return this.props.status;
	}

	get sortOrder() {
		return this.props.sortOrder;
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

	get totalProductsQuantity() {
		return this.props.items.reduce((total, item) => {
			return total + item.quantity;
		}, 0);
	}

	static create(props: IOfferDetailsProps) {
		const offer = new OfferDetails(props);

		return offer;
	}
}
