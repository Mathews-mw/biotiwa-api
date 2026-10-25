import z from 'zod';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const promotionRedemptionStatusSchema = z.enum(['PENDING', 'REDEEMED', 'CANCELED', 'EXPIRED']);
export type IPromotionRedemptionStatus = z.infer<typeof promotionRedemptionStatusSchema>;

export interface PromotionRedemptionProps {
	promotionCodeId: UniqueEntityId;
	userId: UniqueEntityId;
	orderId: UniqueEntityId;
	status: IPromotionRedemptionStatus;
	discountAmount: number;
	reservedUntil?: Date | null;
	redeemedAt?: Date | null;
	canceledAt?: Date | null;
	expiredAt?: Date | null;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class PromotionRedemption extends Entity<PromotionRedemptionProps> {
	get promotionCodeId() {
		return this.props.promotionCodeId;
	}

	set promotionCodeId(promotionCodeId: UniqueEntityId) {
		this.props.promotionCodeId = promotionCodeId;
		this._touch();
	}

	get userId() {
		return this.props.userId;
	}

	set userId(userId: UniqueEntityId) {
		this.props.userId = userId;
		this._touch();
	}

	get orderId() {
		return this.props.orderId;
	}

	set orderId(orderId: UniqueEntityId) {
		this.props.orderId = orderId;
		this._touch();
	}

	get status() {
		return this.props.status;
	}

	set status(status: IPromotionRedemptionStatus) {
		this.props.status = status;
		this._touch();
	}

	get discountAmount() {
		return this.props.discountAmount;
	}

	set discountAmount(discountAmount: number) {
		this.props.discountAmount = discountAmount;
		this._touch();
	}

	get reservedUntil() {
		return this.props.reservedUntil;
	}

	set reservedUntil(reservedUntil: Date | null | undefined) {
		this.props.reservedUntil = reservedUntil;
		this._touch();
	}

	get redeemedAt() {
		return this.props.redeemedAt;
	}

	set redeemedAt(redeemedAt: Date | null | undefined) {
		this.props.redeemedAt = redeemedAt;
		this._touch();
	}

	get canceledAt() {
		return this.props.canceledAt;
	}

	set canceledAt(canceledAt: Date | null | undefined) {
		this.props.canceledAt = canceledAt;
		this._touch();
	}

	get expiresAt() {
		return this.props.expiredAt;
	}

	set expiresAt(expiredAt: Date | null | undefined) {
		this.props.expiredAt = expiredAt;
		this._touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	markAsRedeemed() {
		if (this.props.status === 'REDEEMED') {
			return;
		}

		this.props.status = 'REDEEMED';

		this.props.redeemedAt = new Date();

		this.props.reservedUntil = null;

		this._touch();
	}

	markAsCanceled() {
		if (this.props.status !== 'PENDING') {
			return;
		}

		this.props.status = 'CANCELED';

		this.props.canceledAt = new Date();

		this.props.reservedUntil = null;

		this._touch();
	}

	markAsExpired() {
		if (this.props.status !== 'PENDING') {
			return;
		}

		this.props.status = 'EXPIRED';

		this.props.expiredAt = new Date();

		this.props.reservedUntil = null;

		this._touch();
	}

	private _touch() {
		this.props.updatedAt = new Date();
	}

	static create(props: Optional<PromotionRedemptionProps, 'status' | 'createdAt'>, id?: UniqueEntityId) {
		const now = new Date();

		return new PromotionRedemption(
			{
				...props,
				status: props.status ?? 'PENDING',
				createdAt: props.createdAt ?? now,
			},
			id
		);
	}
}
