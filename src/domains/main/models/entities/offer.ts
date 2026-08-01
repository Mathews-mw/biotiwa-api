import z from 'zod';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { IMarketCode } from '@/core/types/market-code';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const offerStatusSchema = z.enum(['DRAFT', 'ARCHIVED', 'ACTIVE']);

export type IOfferStatus = z.infer<typeof offerStatusSchema>;

export interface IOfferProps {
	slug: string;
	marketCode: IMarketCode;
	name: string;
	description: string;
	unitAmount: number;
	discountPercent: number;
	isHighlighted: boolean;
	status: IOfferStatus;
	sortOrder: number;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Offer extends Entity<IOfferProps> {
	get slug() {
		return this.props.slug;
	}

	set slug(slug: string) {
		this.props.slug = slug;
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

	get discountPercent() {
		return this.props.discountPercent;
	}

	set discountPercent(discountPercent: number) {
		this.props.discountPercent = discountPercent;
		this._touch();
	}

	get isHighlighted() {
		return this.props.isHighlighted;
	}

	set isHighlighted(isHighlighted: boolean) {
		this.props.isHighlighted = isHighlighted;
		this._touch();
	}

	get status() {
		return this.props.status;
	}

	set status(status: IOfferStatus) {
		this.props.status = status;
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
		props: Optional<IOfferProps, 'discountPercent' | 'isHighlighted' | 'status' | 'sortOrder' | 'createdAt'>,
		id?: UniqueEntityId
	) {
		const offer = new Offer(
			{
				...props,
				discountPercent: props.discountPercent ?? 0,
				isHighlighted: props.isHighlighted ?? false,
				status: props.status ?? 'DRAFT',
				sortOrder: props.sortOrder ?? 0,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return offer;
	}
}
