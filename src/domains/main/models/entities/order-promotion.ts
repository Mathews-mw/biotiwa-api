import type { IPromotionCodeType, IPromotionDiscountType } from './promotion-code';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface OrderPromotionProps {
	orderId: UniqueEntityId;
	sourcePromotionCodeId: UniqueEntityId | null;
	code: string;
	type: IPromotionCodeType;
	discountType: IPromotionDiscountType;
	discountValue: number;
	discountAmount: number;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class OrderPromotion extends Entity<OrderPromotionProps> {
	get orderId() {
		return this.props.orderId;
	}

	set orderId(orderId: UniqueEntityId) {
		this.props.orderId = orderId;
		this._touch();
	}

	get sourcePromotionCodeId() {
		return this.props.sourcePromotionCodeId;
	}

	set sourcePromotionCodeId(sourcePromotionCodeId: UniqueEntityId | null) {
		this.props.sourcePromotionCodeId = sourcePromotionCodeId;
		this._touch();
	}

	get code() {
		return this.props.code;
	}

	set code(code: string) {
		this.props.code = code;
		this._touch();
	}

	get type() {
		return this.props.type;
	}

	set type(type: IPromotionCodeType) {
		this.props.type = type;
		this._touch();
	}

	get discountType() {
		return this.props.discountType;
	}

	set discountType(discountType: IPromotionDiscountType) {
		this.props.discountType = discountType;
		this._touch();
	}

	get discountValue() {
		return this.props.discountValue;
	}

	set discountValue(discountValue: number) {
		this.props.discountValue = discountValue;
		this._touch();
	}

	get discountAmount() {
		return this.props.discountAmount;
	}

	set discountAmount(discountAmount: number) {
		this.props.discountAmount = discountAmount;
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

	static create(props: Optional<OrderPromotionProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId) {
		const now = new Date();

		return new OrderPromotion(
			{
				...props,
				createdAt: props.createdAt ?? now,
				updatedAt: props.updatedAt ?? now,
			},
			id
		);
	}
}
