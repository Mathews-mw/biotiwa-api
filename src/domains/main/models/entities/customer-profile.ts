import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { IMarketCode } from '@/core/types/market-code';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface ICustomerProfileProps {
	userId: UniqueEntityId;
	preferredMarket?: IMarketCode | null;
	phone?: string | null;
	birthDate?: Date | null;
	document?: string | null;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class CustomerProfile extends Entity<ICustomerProfileProps> {
	get userId() {
		return this.props.userId;
	}

	set userId(userId: UniqueEntityId) {
		this.props.userId = userId;
		this._touch();
	}

	get preferredMarket() {
		return this.props.preferredMarket;
	}

	set preferredMarket(preferredMarket: IMarketCode | null | undefined) {
		this.props.preferredMarket = preferredMarket;
		this._touch();
	}

	get phone() {
		return this.props.phone;
	}

	set phone(phone: string | null | undefined) {
		this.props.phone = phone;
		this._touch();
	}

	get birthDate() {
		return this.props.birthDate;
	}

	set birthDate(birthDate: Date | null | undefined) {
		this.props.birthDate = birthDate;
		this._touch();
	}

	get document() {
		return this.props.document;
	}

	set document(document: string | null | undefined) {
		this.props.document = document;
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

	static create(props: Optional<ICustomerProfileProps, 'createdAt'>, id?: UniqueEntityId) {
		const customerProfile = new CustomerProfile({ ...props, createdAt: props.createdAt ?? new Date() }, id);

		return customerProfile;
	}
}
