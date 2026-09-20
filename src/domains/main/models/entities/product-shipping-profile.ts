import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IProductShippingProfileProps {
	productId: UniqueEntityId;
	isShippable: boolean;
	weightInGrams: number;
	widthInMillimeters: number;
	heightInMillimeters: number;
	lengthInMillimeters: number;
	insuranceAmount?: number | null;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class ProductShippingProfile extends Entity<IProductShippingProfileProps> {
	get productId() {
		return this.props.productId;
	}

	set productId(productId: UniqueEntityId) {
		this.props.productId = productId;
		this._touch();
	}

	get isShippable() {
		return this.props.isShippable;
	}

	set isShippable(isShippable: boolean) {
		this.props.isShippable = isShippable;
		this._touch();
	}

	get weightInGrams() {
		return this.props.weightInGrams;
	}

	set weightInGrams(weightInGrams: number) {
		this.props.weightInGrams = weightInGrams;
		this._touch();
	}

	get widthInMillimeters() {
		return this.props.widthInMillimeters;
	}

	set widthInMillimeters(widthInMillimeters: number) {
		this.props.widthInMillimeters = widthInMillimeters;
		this._touch();
	}

	get heightInMillimeters() {
		return this.props.heightInMillimeters;
	}

	set heightInMillimeters(heightInMillimeters: number) {
		this.props.heightInMillimeters = heightInMillimeters;
		this._touch();
	}

	get lengthInMillimeters() {
		return this.props.lengthInMillimeters;
	}

	set lengthInMillimeters(lengthInMillimeters: number) {
		this.props.lengthInMillimeters = lengthInMillimeters;
		this._touch();
	}

	get insuranceAmount() {
		return this.props.insuranceAmount;
	}

	set insuranceAmount(insuranceAmount: number | undefined | null) {
		this.props.insuranceAmount = insuranceAmount;
		this._touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	private _touch() {
		this.props.updatedAt = new Date();
	}

	static create(props: Optional<IProductShippingProfileProps, 'createdAt'>, id?: UniqueEntityId) {
		const productShippingProfile = new ProductShippingProfile(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return productShippingProfile;
	}
}
