import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IVerificationProps {
	userId: UniqueEntityId;
	identifier: string;
	value: string;
	expiresAt: Date;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Verification extends Entity<IVerificationProps> {
	get userId() {
		return this.props.userId;
	}

	set userId(userId: UniqueEntityId) {
		this.props.userId = userId;
		this._touch();
	}

	get identifier() {
		return this.props.identifier;
	}

	set identifier(identifier: string) {
		this.props.identifier = identifier;
		this._touch();
	}

	get value() {
		return this.props.value;
	}

	set value(value: string) {
		this.props.value = value;
		this._touch();
	}

	get expiresAt() {
		return this.props.expiresAt;
	}

	set expiresAt(expiresAt: Date) {
		this.props.expiresAt = expiresAt;
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

	static create(props: Optional<IVerificationProps, 'createdAt'>, id?: UniqueEntityId) {
		const verification = new Verification({ ...props, createdAt: props.createdAt ?? new Date() }, id);

		return verification;
	}
}
