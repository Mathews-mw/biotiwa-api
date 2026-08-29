import { z } from 'zod';

import { marketCodeSchema } from '@/core/types/market-code';
import { currencyCodeSchema } from '@/core/types/currency-code';
import { orderStatusSchema } from '@/domains/main/models/entities/order';

export const orderSchema = z.object({
	id: z.string(),
	user_id: z.string(),
	cart_id: z.string().nullable(),
	market_code: marketCodeSchema,
	currency: currencyCodeSchema,
	status: orderStatusSchema,
	items_amount: z.number(),
	order_bump_amount: z.number(),
	subtotal_amount: z.number(),
	discount_amount: z.number(),
	tax_amount: z.number(),
	shipping_amount: z.number(),
	total_amount: z.number(),
	expires_at: z.coerce.date().nullable().optional(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type IOrderResponseSchema = z.infer<typeof orderSchema>;
