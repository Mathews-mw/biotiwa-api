import { Affiliate } from '../entities/affiliate';
import { ValueObject } from '@/core/entities/value-object';
import { PromotionCodeDetails } from './promotion-code-details';
import { AffiliatePromotionCode } from '../entities/affiliate-promotion-code';

interface AffiliatePromotionCodeDetailsProps {
	affiliate: Affiliate;
	promotionCode: PromotionCodeDetails;
	affiliatePromotionCode: AffiliatePromotionCode;
}

export class AffiliatePromotionCodeDetails extends ValueObject<AffiliatePromotionCodeDetailsProps> {
	get affiliate() {
		return this.props.affiliate;
	}

	get promotionCode() {
		return this.props.promotionCode;
	}

	get affiliatePromotionCode() {
		return this.props.affiliatePromotionCode;
	}

	static create(props: AffiliatePromotionCodeDetailsProps) {
		const item = new AffiliatePromotionCodeDetails(props);

		return item;
	}
}
