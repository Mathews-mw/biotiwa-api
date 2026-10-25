import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { currencyCodeSchema } from '@/core/types/currency-code';

const responseSchema = z.object({
	analyzed_at: z.coerce.date(),
	released_count: z.coerce.number(),
	released_commissions: z.array(
		z.object({
			id: z.string(),
			affiliate_id: z.string(),
			order_id: z.string(),
			commission_amount: z.coerce.number(),
			currency: currencyCodeSchema,
			available_at: z.coerce.date(),
		})
	),
});

export type IReleaseEligibleAffiliateCommissionsResponse = z.infer<typeof responseSchema>;

export const releaseEligibleAffiliateCommissionsSchema: FastifySchema = {
	tags: ['Admin'],
	summary: 'Review all commissions that can be released now and proceed with their release',
	security: [{ cookieAuth: [] }],
	response: {
		200: responseSchema,
	},
};
