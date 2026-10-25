import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { affiliateDetailsSchema } from './affiliate-details-schema';
import { affiliateStatusSchema } from '@/domains/main/models/entities/affiliate';
import { paginationQuerySchema, paginationResponseSchema } from '../pagination-schema';

const querySchema = paginationQuerySchema.extend({
	search: z.string().optional(),
	status: affiliateStatusSchema.optional(),
});

const responseSchema = z.object({
	pagination: paginationResponseSchema,
	affiliates: z.array(affiliateDetailsSchema),
});

export type IListingAffiliatesQuery = z.infer<typeof querySchema>;
export type IListingAffiliatesResponse = z.infer<typeof responseSchema>;

export const listingAffiliatesResponseSchema: FastifySchema = {
	tags: ['Affiliates'],
	summary: 'Listing affiliates',
	security: [{ cookieAuth: [] }],
	querystring: querySchema,
	response: {
		200: responseSchema,
	},
};
