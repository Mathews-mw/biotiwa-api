import z from 'zod';

import type { ICurrencyCode } from '@/core/types/currency-code';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const affiliateCommissionStatusSchema = z.enum(['PENDING', 'AVAILABLE', 'PAID', 'CANCELED']);
export type IAffiliateCommissionStatus = z.infer<typeof affiliateCommissionStatusSchema>;

interface AffiliateCommissionProps {
	affiliateId: UniqueEntityId;
	orderId: UniqueEntityId;
	promotionCode: string;
	commissionBaseAmount: number;
	commissionRate: number;
	commissionAmount: number;
	currency: ICurrencyCode;
	status: IAffiliateCommissionStatus;
	availableAt?: Date | null;
	paidAt?: Date | null;
	canceledAt: Date | null;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class AffiliateCommission extends Entity<AffiliateCommissionProps> {
	get affiliateId() {
		return this.props.affiliateId;
	}

	set affiliateId(affiliateId: UniqueEntityId) {
		this.props.affiliateId = affiliateId;
		this.touch();
	}

	get orderId() {
		return this.props.orderId;
	}

	set orderId(orderId: UniqueEntityId) {
		this.props.orderId = orderId;
		this.touch();
	}

	get promotionCode() {
		return this.props.promotionCode;
	}

	set promotionCode(promotionCode: string) {
		this.props.promotionCode = promotionCode;
		this.touch();
	}

	get commissionBaseAmount() {
		return this.props.commissionBaseAmount;
	}

	set commissionBaseAmount(commissionBaseAmount: number) {
		this.props.commissionBaseAmount = commissionBaseAmount;
		this.touch();
	}

	get commissionRate() {
		return this.props.commissionRate;
	}

	set commissionRate(commissionRate: number) {
		this.props.commissionRate = commissionRate;
		this.touch();
	}

	get commissionAmount() {
		return this.props.commissionAmount;
	}

	set commissionAmount(commissionAmount: number) {
		this.props.commissionAmount = commissionAmount;
		this.touch();
	}

	get currency() {
		return this.props.currency;
	}

	set currency(currency: ICurrencyCode) {
		this.props.currency = currency;
		this.touch();
	}

	get status() {
		return this.props.status;
	}

	set status(status: IAffiliateCommissionStatus) {
		this.props.status = status;
		this.touch();
	}

	get availableAt() {
		return this.props.availableAt;
	}

	set availableAt(availableAt: Date | null | undefined) {
		this.props.availableAt = availableAt;
		this.touch();
	}

	get paidAt() {
		return this.props.paidAt;
	}

	set paidAt(paidAt: Date | null | undefined) {
		this.props.paidAt = paidAt;
		this.touch();
	}

	get canceledAt() {
		return this.props.canceledAt;
	}

	set canceledAt(canceledAt: Date | null) {
		this.props.canceledAt = canceledAt;
		this.touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	markAsAvailable(availableAt = new Date()) {
		if (this.props.status === 'AVAILABLE') {
			return;
		}

		if (this.props.status !== 'PENDING') {
			return;
		}

		this.props.status = 'AVAILABLE';

		this.props.availableAt = availableAt;

		this.touch();
	}

	markAsPaid(paidAt = new Date()) {
		if (this.props.status === 'PAID') {
			return;
		}

		if (this.props.status !== 'AVAILABLE') {
			return;
		}

		this.props.status = 'PAID';

		this.props.paidAt = paidAt;

		this.touch();
	}

	cancel(canceledAt = new Date()) {
		if (this.props.status === 'CANCELED') {
			return;
		}

		/*
		 * Uma comissão já paga não deve
		 * simplesmente virar CANCELED.
		 *
		 * Isso posteriormente precisa de
		 * estorno/ajuste financeiro.
		 */
		if (this.props.status === 'PAID') {
			return;
		}

		this.props.status = 'CANCELED';

		this.props.canceledAt = canceledAt;

		this.touch();
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	static create(
		props: Optional<
			AffiliateCommissionProps,
			'status' | 'availableAt' | 'paidAt' | 'canceledAt' | 'createdAt' | 'updatedAt'
		>,
		id?: UniqueEntityId
	) {
		if (props.commissionBaseAmount < 0) {
			throw new Error('Commission base amount cannot be negative.');
		}

		if (props.commissionRate < 0 || props.commissionRate > 10_000) {
			throw new Error('Commission rate must be between 0% and 100%.');
		}

		if (props.commissionAmount < 0) {
			throw new Error('Commission amount cannot be negative.');
		}

		const now = new Date();

		return new AffiliateCommission(
			{
				...props,
				status: props.status ?? 'PENDING',
				availableAt: props.availableAt ?? null,
				paidAt: props.paidAt ?? null,
				canceledAt: props.canceledAt ?? null,
				createdAt: props.createdAt ?? now,
				updatedAt: props.updatedAt ?? now,
			},
			id
		);
	}
}
