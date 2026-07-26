import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IUserConsentProps {
	userId: UniqueEntityId;
	termId: UniqueEntityId;
	acceptedAt: Date;
	ipAddress?: string | null;
	userAgent?: string | null;
}

export class UserConsent extends Entity<IUserConsentProps> {
	get userId() {
		return this.props.userId;
	}

	set userId(userId: UniqueEntityId) {
		this.props.userId = userId;
	}

	get termId() {
		return this.props.termId;
	}

	set termId(termId: UniqueEntityId) {
		this.props.termId = termId;
	}

	get acceptedAt() {
		return this.props.acceptedAt;
	}

	set acceptedAt(acceptedAt: Date) {
		this.props.acceptedAt = acceptedAt;
	}

	get ipAddress() {
		return this.props.ipAddress;
	}

	set ipAddress(ipAddress: string | null | undefined) {
		this.props.ipAddress = ipAddress;
	}

	get userAgent() {
		return this.props.userAgent;
	}

	set userAgent(userAgent: string | null | undefined) {
		this.props.userAgent = userAgent;
	}

	static create(props: IUserConsentProps, id?: UniqueEntityId) {
		const userConsent = new UserConsent(props, id);

		return userConsent;
	}
}
