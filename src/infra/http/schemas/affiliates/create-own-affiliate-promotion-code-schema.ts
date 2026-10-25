import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { marketCodeSchema } from '@/core/types/market-code';
import { getBadRequestErrorSchema, getNotFoundErrorSchema } from '../erros/erros-schemas';
import { affiliatePromotionCodeDetailsSchema } from './affiliate-promotion-code-details-schema';

const bodySchema = z.object({
	market_code: marketCodeSchema,
	code: z
		.string()
		.trim()
		.min(4)
		.max(24)
		.regex(/^[a-zA-Z0-9-]+$/),
	expires_in_days: z.number().int().positive(),
	max_uses_per_customer: z.number().int().positive().nullable().optional(),
});

const responseSchema = z.object({
	message: z.string(),
	affiliate_promotion_code: affiliatePromotionCodeDetailsSchema,
});

export type ICreateOwnAffiliatePromotionCodeRequest = z.infer<typeof bodySchema>;
export type ICreateOwnAffiliatePromotionCodeResponse = z.infer<typeof responseSchema>;

export const createOwnAffiliatePromotionCodeSchema: FastifySchema = {
	tags: ['Affiliates'],
	summary: 'Create own affiliate promotion code',
	security: [{ cookieAuth: [] }],
	body: bodySchema,
	response: {
		201: responseSchema,
		400: getBadRequestErrorSchema
			.startWith('BAD_REQUEST_ERROR')
			.include('AFFILIATE_NOT_ACTIVE')
			.include('AFFILIATE_PROGRAM_NOT_ACTIVE')
			.include('AFFILIATE_CODE_CREATION_DISABLED')
			.include('AFFILIATE_ACTIVE_CODE_LIMIT_REACHED')
			.include('AFFILIATE_CODE_LIFETIME_OUT_OF_RANGE')
			.include('AFFILIATE_MAX_USES_PER_CUSTOMER_OUT_OF_RANGE')
			.include('PROMOTION_CODE_ALREADY_EXISTS')
			.getErrorSchema(),
		404: getNotFoundErrorSchema
			.startWith('RESOURCE_NOT_FOUND_ERROR')
			.include('AFFILIATE_NOT_FOUND')
			.include('AFFILIATE_PROGRAM_SETTINGS_NOT_FOUND')
			.getErrorSchema(),
	},
};
