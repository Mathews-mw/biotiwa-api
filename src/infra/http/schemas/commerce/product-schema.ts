import { z } from 'zod';
import { productStatusSchema } from '@/domains/main/models/entities/product';

export const productSchema = z.object({
	id: z.string(),
	sku: z.string(),
	slug: z.string(),
	name: z.string(),
	short_description: z.string(),
	description: z.string().nullable().optional(),
	image_url: z.string().nullable().optional(),
	pills_per_pack: z.coerce.number().nullable().optional(),
	status: productStatusSchema,
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type IProductResponseSchema = z.infer<typeof productSchema>;
