import { IRole } from '@/core/auth/roles';
import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IUserProps {
	name: string;
	email: string;
	emailVerified: boolean;
	image?: string | null;
	role: IRole;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class User extends Entity<IUserProps> {
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

	get emailVerified() {
		return this.props.emailVerified;
	}

	set emailVerified(emailVerified: boolean) {
		this.props.emailVerified = emailVerified;
		this._touch();
	}

	get image() {
		return this.props.image;
	}

	set image(image: string | undefined | null) {
		this.props.image = image;
		this._touch();
	}

	get role() {
		return this.props.role;
	}

	set role(role: IRole) {
		this.props.role = role;
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

	static create(props: Optional<IUserProps, 'emailVerified' | 'role' | 'createdAt'>, id?: UniqueEntityId) {
		const user = new User(
			{
				...props,
				emailVerified: props.emailVerified ?? false,
				role: props.role ?? 'CUSTOMER',
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return user;
	}
}
