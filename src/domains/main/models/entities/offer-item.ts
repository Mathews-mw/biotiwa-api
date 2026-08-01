import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IOfferItemProps {
	offerId: UniqueEntityId;
	productId: UniqueEntityId;
	quantity: number;
	createdAt: Date;
}

export class OfferItem extends Entity<IOfferItemProps> {
	get offerId() {
		return this.props.offerId;
	}

	set offerId(offerId: UniqueEntityId) {
		this.props.offerId = offerId;
	}

	get productId() {
		return this.props.productId;
	}

	set productId(productId: UniqueEntityId) {
		this.props.productId = productId;
	}

	get quantity() {
		return this.props.quantity;
	}

	set quantity(quantity: number) {
		this.props.quantity = quantity;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	static create(props: Optional<IOfferItemProps, 'createdAt'>, id?: UniqueEntityId) {
		const offerItem = new OfferItem(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return offerItem;
	}
}
