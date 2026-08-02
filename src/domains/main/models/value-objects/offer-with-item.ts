import { OfferItem } from '../entities/offer-item';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import type { IOfferProps } from '../entities/offer';

export interface IOfferWithItemsProps extends IOfferProps {
	id: UniqueEntityId;
	items: Array<OfferItem>;
}

export class OfferWithItems extends ValueObject<IOfferWithItemsProps> {
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

	static create(props: IOfferWithItemsProps) {
		const roomDetails = new OfferWithItems(props);

		return roomDetails;
	}
}
