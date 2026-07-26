import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface ISessionProps {
	userId: UniqueEntityId;
	token: string;
	ipAddress?: string | null;
	userAgent?: string | null;
	expiresAt: Date;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Session extends Entity<ISessionProps> {
	get userId() {
		return this.props.userId;
	}

	set userId(userId: UniqueEntityId) {
		this.props.userId = userId;
		this._touch();
	}

	get token() {
		return this.props.token;
	}

	set token(token: string) {
		this.props.token = token;
		this._touch();
	}

	get ipAddress() {
		return this.props.ipAddress;
	}

	set ipAddress(ipAddress: string | null | undefined) {
		this.props.ipAddress = ipAddress;
		this._touch();
	}

	get userAgent() {
		return this.props.userAgent;
	}

	set userAgent(userAgent: string | null | undefined) {
		this.props.userAgent = userAgent;
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

	static create(props: Optional<ISessionProps, 'createdAt'>, id?: UniqueEntityId) {
		const session = new Session({ ...props, createdAt: props.createdAt ?? new Date() }, id);

		return session;
	}
}
