import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { affiliatePromotionCodeDetailsSchema } from './affiliate-promotion-code-details-schema';

const responseSchema = z.object({
	promotion_codes: z.array(affiliatePromotionCodeDetailsSchema),
});

export type IListAffiliatePromotionCodesResponse = z.infer<typeof responseSchema>;

export const listAffiliatePromotionCodesResponseSchema: FastifySchema = {
	tags: ['Affiliates'],
	summary: 'Listing affiliate promotion codes',
	security: [{ cookieAuth: [] }],
	response: {
		200: responseSchema,
	},
};
