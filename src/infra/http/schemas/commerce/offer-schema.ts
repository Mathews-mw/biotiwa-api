import { z } from 'zod';
import { offerStatusSchema } from '@/domains/main/models/entities/offer';
import { marketCodeSchema } from '@/core/types/market-code';

export const offerSchema = z.object({
	id: z.string(),
	slug: z.string(),
	market_code: marketCodeSchema,
	name: z.string(),
	description: z.string(),
	unit_amount: z.int(),
	discount_percent: z.int(),
	is_highlighted: z.coerce.boolean(),
	status: offerStatusSchema,
	sort_order: z.int(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type IOfferResponseSchema = z.infer<typeof offerSchema>;
