import { z } from 'zod';

import { affiliateStatusSchema, affiliateTypeSchema } from '@/domains/main/models/entities/affiliate';

export const affiliateSchema = z.object({
	id: z.string(),
	user_id: z.string(),
	type: affiliateTypeSchema,
	status: affiliateStatusSchema,
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type IAffiliateResponseSchema = z.infer<typeof affiliateSchema>;
