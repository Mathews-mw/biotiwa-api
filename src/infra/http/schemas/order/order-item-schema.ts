import { z } from 'zod';

import { orderItemTypeSchema } from '@/domains/main/models/entities/order-item';

export const orderItemSchema = z.object({
	id: z.string(),
	order_d: z.string(),
	product_d: z.string().nullable().optional(),
	type: orderItemTypeSchema,
	name: z.string(),
	sku: z.string(),
	quantity: z.number(),
	unit_amount: z.number(),
	total_amount: z.number(),
	metadata: z.record(z.string(), z.unknown()).nullable().optional(),
	created_at: z.coerce.date(),
});

export type IOrderItemResponseSchema = z.infer<typeof orderItemSchema>;
