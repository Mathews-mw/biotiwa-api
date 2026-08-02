import { z } from 'zod';

import { marketCodeSchema } from '@/core/types/market-code';

export const orderBumpSchema = z.object({
	id: z.string(),
	product_id: z.string(),
	market_code: marketCodeSchema,
	name: z.string(),
	description: z.string(),
	unit_amount: z.int(),
	quantity: z.int(),
	is_active: z.coerce.boolean(),
	sort_order: z.int(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type IOrderBumpResponseSchema = z.infer<typeof orderBumpSchema>;
