import z from 'zod';

import { promotionCodeTypeSchema, promotionDiscountTypeSchema } from '@/domains/main/models/entities/promotion-code';

export const orderPromotionSchema = z.object({
	id: z.string(),
	order_id: z.string(),
	source_promotion_code_id: z.string().nullable().optional(),
	code: z.string(),
	type: promotionCodeTypeSchema,
	discount_type: promotionDiscountTypeSchema,
	discount_value: z.coerce.number(),
	discount_amount: z.coerce.number(),
	affiliate_id: z.string().nullable().optional(),
	affiliate_promotion_code_id: z.string().nullable().optional(),
	affiliate_commission_rate: z.coerce.number().nullable().optional(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type IOrderPromotionResponseSchema = z.infer<typeof orderPromotionSchema>;
