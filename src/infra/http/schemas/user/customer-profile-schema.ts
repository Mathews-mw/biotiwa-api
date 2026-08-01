import { z } from 'zod';
import { marketCodeSchema } from '@/core/types/market-code';

export const customerProfileSchema = z.object({
	id: z.string(),
	user_id: z.string(),
	preferred_market: marketCodeSchema.optional().nullable(),
	phone: z.string().optional().nullable(),
	birth_date: z.coerce.date().optional().nullable(),
	document: z.string().optional().nullable(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().optional().nullable(),
});

export type ICustomerProfileResponseSchema = z.infer<typeof customerProfileSchema>;
