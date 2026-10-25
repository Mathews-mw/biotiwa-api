import { z } from 'zod';

import { promotionCodeSchema } from './promotion-code-schema';
import { promotionRedemptionSchema } from './promotion-redemption-schema';

export const promotionCodeDetailsSchema = promotionCodeSchema.extend({
	redemptions: z.array(promotionRedemptionSchema),
});

export type IPromotionCodeDetailsResponseSchema = z.infer<typeof promotionCodeDetailsSchema>;
