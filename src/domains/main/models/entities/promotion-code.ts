import z from 'zod';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { IMarketCode } from '@/core/types/market-code';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const promotionCodeTypeSchema = z.enum(['COUPON', 'AFFILIATE']);
export type IPromotionCodeType = z.infer<typeof promotionCodeTypeSchema>;

export const promotionCodeStatusSchema = z.enum(['ACTIVE', 'INACTIVE']);
export type IPromotionCodeStatus = z.infer<typeof promotionCodeStatusSchema>;

export const promotionDiscountTypeSchema = z.enum(['PERCENTAGE', 'FIXED']);
export type IPromotionDiscountType = z.infer<typeof promotionDiscountTypeSchema>;

export interface PromotionCodeProps {
	code: string;
	type: IPromotionCodeType;
	status: IPromotionCodeStatus;
	marketCode: IMarketCode;
	discountType: IPromotionDiscountType;
	discountValue: number;
	maxUses: number | null;
	maxUsesPerCustomer: number | null;
	startsAt: Date | null;
	expiresAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export class PromotionCode extends Entity<PromotionCodeProps> {
	get code() {
		return this.props.code;
	}

	set code(code: string) {
		this.props.code = PromotionCode.normalizeCode(code);
		this._touch();
	}

	get type() {
		return this.props.type;
	}

	set type(type: IPromotionCodeType) {
		this.props.type = type;
		this._touch();
	}

	get status() {
		return this.props.status;
	}

	set status(status: IPromotionCodeStatus) {
		this.props.status = status;
		this._touch();
	}

	get marketCode() {
		return this.props.marketCode;
	}

	set marketCode(marketCode: IMarketCode) {
		this.props.marketCode = marketCode;
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

	get maxUses() {
		return this.props.maxUses;
	}

	set maxUses(maxUses: number | null) {
		this.props.maxUses = maxUses;
		this._touch();
	}

	get maxUsesPerCustomer() {
		return this.props.maxUsesPerCustomer;
	}

	set maxUsesPerCustomer(maxUsesPerCustomer: number | null) {
		this.props.maxUsesPerCustomer = maxUsesPerCustomer;
		this._touch();
	}

	get startsAt() {
		return this.props.startsAt;
	}

	set startsAt(startsAt: Date | null) {
		this.props.startsAt = startsAt;
		this._touch();
	}

	get expiresAt() {
		return this.props.expiresAt;
	}

	set expiresAt(expiresAt: Date | null) {
		this.props.expiresAt = expiresAt;
		this._touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get isActive() {
		return this.status === 'ACTIVE';
	}

	private _touch() {
		this.props.updatedAt = new Date();
	}

	hasStarted(referenceDate = new Date()) {
		if (!this.startsAt) {
			return true;
		}

		return this.startsAt.getTime() <= referenceDate.getTime();
	}

	isExpired(referenceDate = new Date()) {
		if (!this.expiresAt) {
			return false;
		}

		return this.expiresAt.getTime() <= referenceDate.getTime();
	}

	static normalizeCode(code: string) {
		return code.trim().toUpperCase();
	}

	static create(
		props: Optional<
			PromotionCodeProps,
			'status' | 'maxUses' | 'maxUsesPerCustomer' | 'startsAt' | 'expiresAt' | 'createdAt' | 'updatedAt'
		>,
		id?: UniqueEntityId
	) {
		const now = new Date();

		return new PromotionCode(
			{
				...props,
				code: PromotionCode.normalizeCode(props.code),
				status: props.status ?? 'ACTIVE',
				maxUses: props.maxUses ?? null,
				maxUsesPerCustomer: props.maxUsesPerCustomer ?? null,
				startsAt: props.startsAt ?? null,
				expiresAt: props.expiresAt ?? null,
				createdAt: props.createdAt ?? now,
				updatedAt: props.updatedAt ?? now,
			},
			id
		);
	}
}
