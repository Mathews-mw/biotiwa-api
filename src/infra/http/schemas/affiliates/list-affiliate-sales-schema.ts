import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { currencyCodeSchema } from '@/core/types/currency-code';
import { getNotFoundErrorSchema } from '../erros/erros-schemas';
import { paginationQuerySchema, paginationResponseSchema } from '../pagination-schema';
import { affiliateCommissionStatusSchema } from '@/domains/main/models/entities/affiliate-commission';

const querySchema = paginationQuerySchema.extend({
	currency: z.optional(currencyCodeSchema),
	commission_status: z.optional(affiliateCommissionStatusSchema),
});

const responseSchema = z.object({
	pagination: paginationResponseSchema,
	sales: z.array(
		z.object({
			commission_id: z.string(),
			order_id: z.string(),
			promotion_code: z.string(),
			sale_amount: z.coerce.number(),
			commission_rate: z.coerce.number(),
			commission_amount: z.coerce.number(),
			commission_status: affiliateCommissionStatusSchema,
			currency: currencyCodeSchema,
			created_at: z.coerce.date(),
		})
	),
});

export type IListAffiliateSalesQuery = z.infer<typeof querySchema>;
export type IListAffiliateSalesResponse = z.infer<typeof responseSchema>;

export const listAffiliateSalesResponseSchema: FastifySchema = {
	tags: ['Affiliates'],
	summary: 'Listing affiliate sales',
	security: [{ cookieAuth: [] }],
	querystring: querySchema,
	response: {
		200: responseSchema,
		404: getNotFoundErrorSchema.startWith('RESOURCE_NOT_FOUND_ERROR').include('AFFILIATE_NOT_FOUND').getErrorSchema(),
	},
};
