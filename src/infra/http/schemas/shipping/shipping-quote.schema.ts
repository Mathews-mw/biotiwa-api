import z from 'zod';

import { marketCodeSchema } from '@/core/types/market-code';
import { shippingQuoteStatusSchema } from '@/domains/main/models/entities/shipping-quote';

export const shippingQuoteSchema = z.object({
	id: z.string(),
	user_id: z.string(),
	cart_id: z.string(),
	market_code: marketCodeSchema,
	destination_postal_code: z.string(),
	cart_fingerprint: z.string(),
	status: shippingQuoteStatusSchema,
	expires_at: z.coerce.date(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type IShippingQuoteResponseSchema = z.infer<typeof shippingQuoteSchema>;
