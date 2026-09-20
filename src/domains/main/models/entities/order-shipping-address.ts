// src/domains/main/models/entities/order-shipping-address.ts

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IOrderShippingAddressProps {
	orderId: UniqueEntityId;
	zipCode: string;
	street: string;
	number?: string | null;
	complement?: string | null;
	district?: string | null;
	city: string;
	state: string;
	countryCode: string;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class OrderShippingAddress extends Entity<IOrderShippingAddressProps> {
	get orderId() {
		return this.props.orderId;
	}

	set orderId(orderId: UniqueEntityId) {
		this.props.orderId = orderId;
		this._touch();
	}

	get zipCode() {
		return this.props.zipCode;
	}

	set zipCode(zipCode: string) {
		this.props.zipCode = zipCode;
		this._touch();
	}

	get street() {
		return this.props.street;
	}

	set street(street: string) {
		this.props.street = street;
		this._touch();
	}

	get number() {
		return this.props.number;
	}

	set number(number: string | null | undefined) {
		this.props.number = number;
		this._touch();
	}

	get complement() {
		return this.props.complement;
	}

	set complement(complement: string | null | undefined) {
		this.props.complement = complement;
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

	get countryCode() {
		return this.props.countryCode;
	}

	set countryCode(countryCode: string) {
		this.props.countryCode = countryCode;
		this._touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	set createdAt(createdAt: Date) {
		this.props.createdAt = createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	private _touch() {
		this.props.updatedAt = new Date();
	}

	static create(props: Optional<IOrderShippingAddressProps, 'createdAt'>, id?: UniqueEntityId) {
		return new OrderShippingAddress(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);
	}
}
