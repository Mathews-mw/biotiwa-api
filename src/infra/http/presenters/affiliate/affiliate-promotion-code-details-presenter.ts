import type { IAffiliatePromotionCodeDetailsResponseSchema } from '../../schemas/affiliates/affiliate-promotion-code-details-schema';

import { AffiliatePresenter } from './affiliate-presenter';
import { PromotionCodePresenter } from '../promotion/promotion-code-presenter';
import { AffiliatePromotionCodePresenter } from './affiliate-promotion-code-presenter';
import { AffiliatePromotionCodeDetails } from '@/domains/main/models/value-objects/affiliate-promotion-code-details';

export class AffiliatePromotionCodeDetailsPresenter {
	static toHTTP(data: AffiliatePromotionCodeDetails): IAffiliatePromotionCodeDetailsResponseSchema {
		return {
			affiliate: AffiliatePresenter.toHTTP(data.affiliate),
			affiliate_promotion_code: AffiliatePromotionCodePresenter.toHTTP(data.affiliatePromotionCode),
			promotion_code: PromotionCodePresenter.toHTTP(data.promotionCode),
		};
	}
}
