import { z } from 'zod';

import { marketCodeSchema } from '@/core/types/market-code';
import {
	promotionCodeStatusSchema,
	promotionCodeTypeSchema,
	promotionDiscountTypeSchema,
} from '@/domains/main/models/entities/promotion-code';

export const promotionCodeSchema = z.object({
	id: z.string(),
	code: z.string(),
	type: promotionCodeTypeSchema,
	status: promotionCodeStatusSchema,
	market_code: marketCodeSchema,
	discount_type: promotionDiscountTypeSchema,
	discount_value: z.coerce
		.number()
		.describe(
			'Valor do desconto (`discount_value`) depende do tipo de desconto (`discount_type`). Quando `discount_type` é `PERCENTAGE`, o valor do desconto é um número entre 0 e 100, representando a porcentagem de desconto. Quando `discount_type` é `FIXED`, o valor do desconto é um número representando o valor fixo de desconto na moeda do mercado (`market_code`) em centavos.'
		),
	max_uses: z.coerce.number().nullable().optional(),
	max_uses_per_customer: z.coerce.number().nullable().optional(),
	starts_at: z.coerce.date().nullable().optional(),
	expires_at: z.coerce.date().nullable().optional(),
	is_active: z.coerce.boolean(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type IPromotionCodeResponseSchema = z.infer<typeof promotionCodeSchema>;
