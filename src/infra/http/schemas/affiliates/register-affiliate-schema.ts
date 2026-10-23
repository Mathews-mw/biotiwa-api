import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { affiliateTypeSchema } from '@/domains/main/models/entities/affiliate';
import { affiliateSchema } from './affiliate-schema';
import { getBadRequestErrorSchema, getNotFoundErrorSchema } from '../erros/erros-schemas';

const bodySchema = z.object({
	type: affiliateTypeSchema,
});

const responseSchema = z.object({
	message: z.string(),
	affiliate: affiliateSchema,
});

export type IRegisterAffiliateRequest = z.infer<typeof bodySchema>;
export type IRegisterAffiliateResponse = z.infer<typeof responseSchema>;

export const registerAffiliateSchema: FastifySchema = {
	tags: ['Affiliates'],
	summary: 'Register a new affiliate',
	security: [{ cookieAuth: [] }],
	body: bodySchema,
	response: {
		201: responseSchema,
		400: getBadRequestErrorSchema.startWith('BAD_REQUEST_ERROR').include('AFFILIATE_ALREADY_EXISTS').getErrorSchema(),
		404: getNotFoundErrorSchema.startWith('RESOURCE_NOT_FOUND_ERROR').include('USER_NOT_FOUND').getErrorSchema(),
	},
};
