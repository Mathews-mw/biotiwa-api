import { PromotionCodePresenter } from './promotion-code-presenter';
import { PromotionRedemptionPresenter } from './promotion-redemption-presenter';
import { PromotionCodeDetails } from '@/domains/main/models/value-objects/promotion-code-details';
import type { IPromotionCodeDetailsResponseSchema } from '../../schemas/promotion/promotion-code-details-schema';

export class PromotionCodeDetailsPresenter {
	static toHTTP(data: PromotionCodeDetails): IPromotionCodeDetailsResponseSchema {
		return {
			...PromotionCodePresenter.toHTTP(data.promotionCode),
			redemptions: data.redemptions.map(PromotionRedemptionPresenter.toHTTP),
		};
	}
}
