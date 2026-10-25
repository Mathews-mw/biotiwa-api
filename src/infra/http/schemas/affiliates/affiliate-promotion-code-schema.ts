import { z } from 'zod';

export const affiliatePromotionCodeSchema = z.object({
	id: z.string(),
	affiliate_id: z.string(),
	promotion_code_id: z.string(),
	commission_rate: z.coerce.number(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type IAffiliatePromotionCodeResponseSchema = z.infer<typeof affiliatePromotionCodeSchema>;
