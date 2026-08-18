import { z } from 'zod';

import { marketCodeSchema } from '@/core/types/market-code';
import { currencyCodeSchema } from '@/core/types/currency-code';
import { cartItemTypeSchema } from '@/domains/main/models/entities/cart-item';

export const checkoutQuoteSchema = z.object({
	quote: z.object({
		cart_id: z.string(),
		market_code: marketCodeSchema,
		currency: currencyCodeSchema,
		expires_at: z.coerce.date(),
		created_at: z.coerce.date(),
		items: z.array(
			z.object({
				cart_item_id: z.string(),
				type: cartItemTypeSchema,
				name: z.string(),
				quantity: z.number(),
				unit_amount: z.number(),
				total_amount: z.number(),
			})
		),
		summary: z.object({
			items_amount: z.number(),
			order_bump_amount: z.number(),
			subtotal_amount: z.number(),
			discount_amount: z.number(),
			tax_amount: z.number(),
			shipping_amount: z.number(),
			total_amount: z.number(),
			currency: currencyCodeSchema,
		}),
	}),
});

export type ICheckoutQuoteResponseSchema = z.infer<typeof checkoutQuoteSchema>;
