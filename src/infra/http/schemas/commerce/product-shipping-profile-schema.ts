import { z } from 'zod';

export const productShippingProfileSchema = z.object({
	id: z.string(),
	product_id: z.string(),
	is_shippable: z.coerce.boolean(),
	weight_in_grams: z.coerce.number(),
	width_in_millimeters: z.coerce.number(),
	height_in_millimeters: z.coerce.number(),
	length_in_millimeters: z.coerce.number(),
	insurance_amount: z.coerce.number().nullable().optional(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type IProductShippingProfileResponseSchema = z.infer<typeof productShippingProfileSchema>;
