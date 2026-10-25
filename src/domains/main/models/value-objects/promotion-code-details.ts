import { PromotionCode } from '../entities/promotion-code';
import { ValueObject } from '@/core/entities/value-object';
import { PromotionRedemption } from '../entities/promotion-redemption';

interface PromotionCodeDetailsProps {
	promotionCode: PromotionCode;
	redemptions: PromotionRedemption[];
}

export class PromotionCodeDetails extends ValueObject<PromotionCodeDetailsProps> {
	get promotionCode() {
		return this.props.promotionCode;
	}

	get redemptions() {
		return this.props.redemptions;
	}

	static create(props: PromotionCodeDetailsProps) {
		const item = new PromotionCodeDetails(props);

		return item;
	}
}
