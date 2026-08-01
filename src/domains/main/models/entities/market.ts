import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { IMarketCode } from '@/core/types/market-code';
import { ICurrencyCode } from '@/core/types/currency-code';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IMarketProps {
	code: IMarketCode;
	label: string;
	locale: string;
	currency: ICurrencyCode;
	shippingAmount: number;
	taxRate: number;
	isActive: boolean;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Market extends Entity<IMarketProps> {
	get code() {
		return this.props.code;
	}

	set code(code: IMarketCode) {
		this.props.code = code;
		this._touch();
	}

	get label() {
		return this.props.label;
	}

	set label(label: string) {
		this.props.label = label;
		this._touch();
	}

	get locale() {
		return this.props.locale;
	}

	set locale(locale: string) {
		this.props.locale = locale;
		this._touch();
	}

	get currency() {
		return this.props.currency;
	}

	set currency(currency: ICurrencyCode) {
		this.props.currency = currency;
		this._touch();
	}

	get shippingAmount() {
		return this.props.shippingAmount;
	}

	set shippingAmount(shippingAmount: number) {
		this.props.shippingAmount = shippingAmount;
		this._touch();
	}

	get taxRate() {
		return this.props.taxRate;
	}

	set taxRate(taxRate: number) {
		this.props.taxRate = taxRate;
		this._touch();
	}

	get isActive() {
		return this.props.isActive;
	}

	set isActive(isActive: boolean) {
		this.props.isActive = isActive;
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

	static create(props: Optional<IMarketProps, 'isActive' | 'createdAt'>, id?: UniqueEntityId) {
		const market = new Market(
			{
				...props,
				isActive: props.isActive ?? true,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return market;
	}
}
