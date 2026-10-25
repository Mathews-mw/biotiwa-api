import { z } from 'zod';

import { promotionRedemptionStatusSchema } from '@/domains/main/models/entities/promotion-redemption';

export const promotionRedemptionSchema = z.object({
	id: z.string(),
	promotion_code_id: z.string(),
	user_id: z.string(),
	order_id: z.string(),
	status: promotionRedemptionStatusSchema,
	discount_amount: z.coerce.number(),
	reserved_until: z.coerce.date().nullable().optional(),
	redeemed_at: z.coerce.date().nullable().optional(),
	canceled_at: z.coerce.date().nullable().optional(),
	expired_at: z.coerce.date().nullable().optional(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type IPromotionRedemptionResponseSchema = z.infer<typeof promotionRedemptionSchema>;
