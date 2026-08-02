import { z } from 'zod';

export const offerItemSchema = z.object({
	id: z.string(),
	offer_id: z.string(),
	product_id: z.string(),
	quantity: z.int(),
	created_at: z.coerce.date(),
});

export type IOfferItemResponseSchema = z.infer<typeof offerItemSchema>;
