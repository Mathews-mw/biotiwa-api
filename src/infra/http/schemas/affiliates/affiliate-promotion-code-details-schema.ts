import { z } from 'zod';

import { affiliateSchema } from './affiliate-schema';
import { affiliatePromotionCodeSchema } from './affiliate-promotion-code-schema';
import { promotionCodeDetailsSchema } from '../promotion/promotion-code-details-schema';

export const affiliatePromotionCodeDetailsSchema = z.object({
	affiliate: affiliateSchema,
	promotion_code: promotionCodeDetailsSchema,
	affiliate_promotion_code: affiliatePromotionCodeSchema,
});

export type IAffiliatePromotionCodeDetailsResponseSchema = z.infer<typeof affiliatePromotionCodeDetailsSchema>;
