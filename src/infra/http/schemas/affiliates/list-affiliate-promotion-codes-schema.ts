import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { affiliatePromotionCodeDetailsSchema } from './affiliate-promotion-code-details-schema';
import { promotionRedemptionStatusSchema } from '@/domains/main/models/entities/promotion-redemption';

const querySchema = z.object({
	redemption_status: z.optional(promotionRedemptionStatusSchema),
});

const responseSchema = z.object({
	promotion_codes: z.array(affiliatePromotionCodeDetailsSchema),
});

export type IListAffiliatePromotionCodesQuery = z.infer<typeof querySchema>;
export type IListAffiliatePromotionCodesResponse = z.infer<typeof responseSchema>;

export const listAffiliatePromotionCodesResponseSchema: FastifySchema = {
	tags: ['Affiliates'],
	summary: 'Listing affiliate promotion codes',
	security: [{ cookieAuth: [] }],
	querystring: querySchema,
	response: {
		200: responseSchema,
	},
};
