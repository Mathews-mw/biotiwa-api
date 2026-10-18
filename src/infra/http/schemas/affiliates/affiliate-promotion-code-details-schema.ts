import { z } from 'zod';

import { affiliateSchema } from './affiliate-schema';
import { promotionCodeSchema } from '../promotion/promotion-code-schema';
import { affiliatePromotionCodeSchema } from './affiliate-promotion-code-schema';

export const affiliatePromotionCodeDetailsSchema = z.object({
	affiliate: affiliateSchema,
	promotion_code: promotionCodeSchema,
	affiliate_promotion_code: affiliatePromotionCodeSchema,
});

export type IAffiliatePromotionCodeDetailsResponseSchema = z.infer<typeof affiliatePromotionCodeDetailsSchema>;
