import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { paginationQuerySchema } from '../pagination-schema';
import { currencyCodeSchema } from '@/core/types/currency-code';
import { getNotFoundErrorSchema } from '../erros/erros-schemas';
import { affiliateStatusSchema, affiliateTypeSchema } from '@/domains/main/models/entities/affiliate';

const querySchema = paginationQuerySchema.extend({
	search: z.optional(z.string()),
});

const responseSchema = z.object({
	affiliate: z.object({
		id: z.string(),
		type: affiliateTypeSchema,
		status: affiliateStatusSchema,
	}),
	sales_count: z.coerce.number(),
	financials: z.array(
		z.object({
			currency: currencyCodeSchema,
			sales_count: z.coerce.number(),
			sales_amount: z.coerce.number(),
			commission_amount: z.coerce.number(),
			pending_amount: z.coerce.number(),
			available_amount: z.coerce.number(),
			paid_amount: z.coerce.number(),
		})
	),
	promotion_codes: z.object({
		total: z.coerce.number(),
		active: z.coerce.number(),
	}),
});

export type IGetAffiliateDashboardQuery = z.infer<typeof querySchema>;
export type IGetAffiliateDashboardResponse = z.infer<typeof responseSchema>;

export const getAffiliateDashboardResponseSchema: FastifySchema = {
	tags: ['Affiliates'],
	summary: 'Get affiliate dashboard',
	security: [{ cookieAuth: [] }],
	querystring: querySchema,
	response: {
		200: responseSchema,
		404: getNotFoundErrorSchema.startWith('RESOURCE_NOT_FOUND_ERROR').include('AFFILIATE_NOT_FOUND').getErrorSchema(),
	},
};
