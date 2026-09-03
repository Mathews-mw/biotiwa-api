import { z } from 'zod';

export const orderShippingAddressSchema = z.object({
	id: z.string(),
	order_d: z.string(),
	zip_code: z.string(),
	street: z.string(),
	number: z.string().nullable().optional(),
	complement: z.string().nullable().optional(),
	district: z.string().nullable().optional(),
	city: z.string(),
	state: z.string(),
	country_code: z.string(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type IOrderShippingAddressResponseSchema = z.infer<typeof orderShippingAddressSchema>;
