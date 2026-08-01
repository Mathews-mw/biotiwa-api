import { z } from 'zod';
import { marketCodeSchema } from '@/core/types/market-code';

export const addressSchema = z.object({
	id: z.string(),
	user_id: z.string(),
	market: marketCodeSchema,
	label: z.string().nullable().optional(),
	recipient: z.string().nullable().optional(),
	postal_code: z.string(),
	address_line_1: z.string(),
	number: z.string().nullable().optional(),
	address_line_2: z.string().nullable().optional(),
	district: z.string().nullable().optional(),
	city: z.string(),
	state: z.string(),
	country: z.string(),
	is_default: z.coerce.boolean(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type IAddressResponseSchema = z.infer<typeof addressSchema>;
