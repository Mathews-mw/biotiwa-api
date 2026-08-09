import { z } from 'zod';

import { cartItemTypeSchema } from '@/domains/main/models/entities/cart-item';

export const cartItemSchema = z.object({
	id: z.string(),
	cart_id: z.string(),
	product_id: z.string().nullable(),
	offer_id: z.string().nullable(),
	order_bump_id: z.string().nullable(),
	type: cartItemTypeSchema,
	quantity: z.coerce.number(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable(),
});

export type ICartItemResponseSchema = z.infer<typeof cartItemSchema>;
