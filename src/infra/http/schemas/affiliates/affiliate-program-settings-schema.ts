import { marketCodeSchema } from '@/core/types/market-code';
import { promotionDiscountTypeSchema } from '@/domains/main/models/entities/promotion-code';
import { z } from 'zod';

export const affiliateProgramSettingsSchema = z.object({
	id: z.string(),
	market_code: marketCodeSchema,
	min_code_lifetime_days: z.coerce.number(),
	max_code_lifetime_days: z.coerce.number(),
	attribution_window_days: z.coerce.number(),
	self_service_code_creation_enabled: z.coerce.boolean(),
	max_active_codes_per_affiliate: z.coerce.number(),
	default_affiliate_discount_type: promotionDiscountTypeSchema,
	default_affiliate_discount_value: z.coerce.number(),
	default_affiliate_commission_rate: z.coerce.number(),
	max_uses_per_customer_limit: z.coerce.number(),
	is_active: z.coerce.boolean(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type IAffiliateProgramSettingsResponseSchema = z.infer<typeof affiliateProgramSettingsSchema>;
