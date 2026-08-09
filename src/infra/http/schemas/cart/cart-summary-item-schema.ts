import { z } from 'zod';

import { cartItemTypeSchema } from '@/domains/main/models/entities/cart-item';

export const cartSummaryItemSchema = z.object({
	cart_item_id: z.string(),
	type: cartItemTypeSchema,
	name: z.string(),
	quantity: z.number(),
	unit_amount: z.number(),
	total_amount: z.number(),
});

export type ICartSummaryItemResponseSchema = z.infer<typeof cartSummaryItemSchema>;
