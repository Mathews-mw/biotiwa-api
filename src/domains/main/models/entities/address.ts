import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { IMarketCode } from '@/core/types/market-code';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IAddressProps {
	userId: UniqueEntityId;
	market: IMarketCode;
	label?: string | null;
	recipient?: string | null;
	postalCode: string;
	addressLine1: string;
	number?: string | null;
	addressLine2?: string | null;
	district?: string | null;
	city: string;
	state: string;
	country: string;
	isDefault: boolean;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Address extends Entity<IAddressProps> {
	get userId() {
		return this.props.userId;
	}

	set userId(userId: UniqueEntityId) {
		this.props.userId = userId;
		this._touch();
	}

	get market() {
		return this.props.market;
	}

	set market(market: IMarketCode) {
		this.props.market = market;
		this._touch();
	}

	get label() {
		return this.props.label;
	}

	set label(label: string | null | undefined) {
		this.props.label = label;
		this._touch();
	}

	get recipient() {
		return this.props.recipient;
	}

	set recipient(recipient: string | null | undefined) {
		this.props.recipient = recipient;
		this._touch();
	}

	get postalCode() {
		return this.props.postalCode;
	}

	set postalCode(postalCode: string) {
		this.props.postalCode = postalCode;
		this._touch();
	}

	get addressLine1() {
		return this.props.addressLine1;
	}

	set addressLine1(addressLine1: string) {
		this.props.addressLine1 = addressLine1;
		this._touch();
	}

	get number() {
		return this.props.number;
	}

	set number(number: string | null | undefined) {
		this.props.number = number;
		this._touch();
	}

	get addressLine2() {
		return this.props.addressLine2;
	}

	set addressLine2(addressLine2: string | null | undefined) {
		this.props.addressLine2 = addressLine2;
		this._touch();
	}

	get district() {
		return this.props.district;
	}

	set district(district: string | null | undefined) {
		this.props.district = district;
		this._touch();
	}

	get city() {
		return this.props.city;
	}

	set city(city: string) {
		this.props.city = city;
		this._touch();
	}

	get state() {
		return this.props.state;
	}

	set state(state: string) {
		this.props.state = state;
		this._touch();
	}

	get country() {
		return this.props.country;
	}

	set country(country: string) {
		this.props.country = country;
		this._touch();
	}

	get isDefault() {
		return this.props.isDefault;
	}

	set isDefault(isDefault: boolean) {
		this.props.isDefault = isDefault;
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

	static create(props: Optional<IAddressProps, 'createdAt' | 'isDefault'>, id?: UniqueEntityId) {
		const address = new Address(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				isDefault: props.isDefault ?? false,
			},
			id
		);

		return address;
	}
}
