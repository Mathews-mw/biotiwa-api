import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';
import { cartDetailsSchema } from './cart-details-schema';
import { cartSummarySchema } from './cart-summary-schema';

const responseSchema = z.object({
	cart: cartDetailsSchema.nullable(),
	summary: cartSummarySchema.nullable(),
});

export type IGetActiveCartResponse = z.infer<typeof responseSchema>;

export const getActiveCartSchema: FastifySchema = {
	tags: ['Cart'],
	summary: 'Get active cart',
	description: 'Get user active cart',
	security: [{ cookieAuth: [] }],
	response: {
		200: responseSchema,
	},
};
