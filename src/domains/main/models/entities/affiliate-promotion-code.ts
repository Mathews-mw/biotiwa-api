import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface AffiliatePromotionCodeProps {
	affiliateId: UniqueEntityId;
	promotionCodeId: UniqueEntityId;
	commissionRate: number;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class AffiliatePromotionCode extends Entity<AffiliatePromotionCodeProps> {
	get affiliateId() {
		return this.props.affiliateId;
	}

	set affiliateId(affiliateId: UniqueEntityId) {
		this.props.affiliateId = affiliateId;
		this._touch();
	}

	get promotionCodeId() {
		return this.props.promotionCodeId;
	}

	set promotionCodeId(promotionCodeId: UniqueEntityId) {
		this.props.promotionCodeId = promotionCodeId;
		this._touch();
	}

	get commissionRate() {
		return this.props.commissionRate;
	}

	set commissionRate(commissionRate: number) {
		if (commissionRate < 0 || commissionRate > 10_000) {
			throw new Error('Affiliate commission rate must be between 0% and 100%.');
		}

		this.props.commissionRate = commissionRate;
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

	static create(props: Optional<AffiliatePromotionCodeProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId) {
		if (props.commissionRate < 0 || props.commissionRate > 10_000) {
			throw new Error('Affiliate commission rate must be between 0% and 100%.');
		}

		const now = new Date();

		return new AffiliatePromotionCode(
			{
				...props,
				createdAt: props.createdAt ?? now,
				updatedAt: props.updatedAt ?? now,
			},
			id
		);
	}
}
