import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { marketCodeSchema } from '@/core/types/market-code';
import { getNotFoundErrorSchema } from '../erros/erros-schemas';
import { affiliateProgramSettingsSchema } from './affiliate-program-settings-schema';

const querySchema = z.object({
	market_code: z.optional(marketCodeSchema).default('BR'),
});

const responseSchema = z.object({
	enabled: z.coerce.boolean(),
	active_codes: z.coerce.number(),
	settings: affiliateProgramSettingsSchema,
});

export type IGetAffiliatePromotionCodeSettingsQuery = z.infer<typeof querySchema>;
export type IGetAffiliatePromotionCodeSettingsResponse = z.infer<typeof responseSchema>;

export const getAffiliatePromotionCodeSettingsResponseSchema: FastifySchema = {
	tags: ['Affiliates'],
	summary: 'Listing affiliate promotion code settings',
	security: [{ cookieAuth: [] }],
	querystring: querySchema,
	response: {
		200: responseSchema,
		404: getNotFoundErrorSchema
			.startWith('RESOURCE_NOT_FOUND_ERROR')
			.include('AFFILIATE_NOT_FOUND')
			.include('AFFILIATE_PROGRAM_SETTINGS_NOT_FOUND')
			.getErrorSchema(),
	},
};
