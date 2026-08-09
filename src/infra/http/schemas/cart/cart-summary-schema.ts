import { z } from 'zod';

import { currencyCodeSchema } from '@/core/types/currency-code';
import { cartSummaryItemSchema } from './cart-summary-item-schema';

export const cartSummarySchema = z.object({
	items_amount: z.number(),
	order_bump_amount: z.number(),
	subtotal_amount: z.number(),
	discount_amount: z.number(),
	tax_amount: z.number(),
	shipping_amount: z.number(),
	total_amount: z.number(),
	currency: currencyCodeSchema,
	items: z.array(cartSummaryItemSchema),
});

export type ICartSummaryResponseSchema = z.infer<typeof cartSummarySchema>;
