import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IOrderCustomerProps {
	orderId: UniqueEntityId;
	name: string;
	email: string;
	phone?: string | null;
	document?: string | null;
	birthDate?: string | null;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class OrderCustomer extends Entity<IOrderCustomerProps> {
	get orderId() {
		return this.props.orderId;
	}

	set orderId(orderId: UniqueEntityId) {
		this.props.orderId = orderId;
		this._touch();
	}

	get name() {
		return this.props.name;
	}

	set name(name: string) {
		this.props.name = name;
		this._touch();
	}

	get email() {
		return this.props.email;
	}

	set email(email: string) {
		this.props.email = email;
		this._touch();
	}

	get phone() {
		return this.props.phone;
	}

	set phone(phone: string | null | undefined) {
		this.props.phone = phone;
		this._touch();
	}

	get document() {
		return this.props.document;
	}

	set document(document: string | null | undefined) {
		this.props.document = document;
		this._touch();
	}

	get birthDate() {
		return this.props.birthDate;
	}

	set birthDate(birthDate: string | null | undefined) {
		this.props.birthDate = birthDate;
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

	static create(props: Optional<IOrderCustomerProps, 'createdAt'>, id?: UniqueEntityId) {
		return new OrderCustomer(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);
	}
}
