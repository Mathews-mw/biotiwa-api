import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { orderDetailsSchema } from './order-details-schema';
import { paginationQuerySchema, paginationResponseSchema } from '../pagination-schema';

const querySchema = paginationQuerySchema.extend({
	search: z.optional(z.string()),
});

const responseSchema = z.object({
	pagination: paginationResponseSchema,
	orders: z.array(orderDetailsSchema),
});

export type IListingUserOrdersQuery = z.infer<typeof querySchema>;
export type IListingUserOrdersResponse = z.infer<typeof responseSchema>;

export const listingUserOrdersResponseSchema: FastifySchema = {
	tags: ['Orders'],
	summary: 'Listing user order history',
	security: [{ cookieAuth: [] }],
	querystring: querySchema,
	response: {
		200: responseSchema,
	},
};
