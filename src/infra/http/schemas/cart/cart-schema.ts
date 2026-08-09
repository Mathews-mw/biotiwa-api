import { z } from 'zod';

import { marketCodeSchema } from '@/core/types/market-code';
import { cartStatusSchema } from '@/domains/main/models/entities/cart';

export const cartSchema = z.object({
	id: z.string(),
	user_id: z.string(),
	market_code: marketCodeSchema,
	status: cartStatusSchema,
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable(),
});

export type ICartResponseSchema = z.infer<typeof cartSchema>;
