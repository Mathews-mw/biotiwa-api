import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { IMarketCode } from '@/core/types/market-code';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IOrderBumpProps {
	productId: UniqueEntityId;
	marketCode: IMarketCode;
	name: string;
	description: string;
	unitAmount: number;
	quantity: number;
	isActive: boolean;
	sortOrder: number;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class OrderBump extends Entity<IOrderBumpProps> {
	get productId() {
		return this.props.productId;
	}

	set productId(productId: UniqueEntityId) {
		this.props.productId = productId;
		this._touch();
	}

	get marketCode() {
		return this.props.marketCode;
	}

	set marketCode(marketCode: IMarketCode) {
		this.props.marketCode = marketCode;
		this._touch();
	}

	get name() {
		return this.props.name;
	}

	set name(name: string) {
		this.props.name = name;
		this._touch();
	}

	get description() {
		return this.props.description;
	}

	set description(description: string) {
		this.props.description = description;
		this._touch();
	}

	get unitAmount() {
		return this.props.unitAmount;
	}

	set unitAmount(unitAmount: number) {
		this.props.unitAmount = unitAmount;
		this._touch();
	}

	get quantity() {
		return this.props.quantity;
	}

	set quantity(quantity: number) {
		this.props.quantity = quantity;
		this._touch();
	}

	get isActive() {
		return this.props.isActive;
	}

	set isActive(isActive: boolean) {
		this.props.isActive = isActive;
		this._touch();
	}

	get sortOrder() {
		return this.props.sortOrder;
	}

	set sortOrder(sortOrder: number) {
		this.props.sortOrder = sortOrder;
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

	static create(
		props: Optional<IOrderBumpProps, 'quantity' | 'isActive' | 'sortOrder' | 'createdAt'>,
		id?: UniqueEntityId
	) {
		const orderBump = new OrderBump(
			{
				...props,
				quantity: props.quantity ?? 1,
				isActive: props.isActive ?? true,
				sortOrder: props.sortOrder ?? 0,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return orderBump;
	}
}
