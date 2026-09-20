import { z } from 'zod';

export const orderCustomerSchema = z.object({
	id: z.string(),
	order_d: z.string(),
	name: z.string(),
	email: z.string(),
	phone: z.string().nullable().optional(),
	document: z.string().nullable().optional(),
	birth_date: z.string().nullable().optional(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type IOrderCustomerResponseSchema = z.infer<typeof orderCustomerSchema>;
