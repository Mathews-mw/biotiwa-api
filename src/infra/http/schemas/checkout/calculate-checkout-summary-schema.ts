import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { checkoutSummarySchema } from './checkout-summary-schema';
import { getBadRequestErrorSchema, getNotFoundErrorSchema } from '../erros/erros-schemas';

const bodySchema = z.object({
	shipping_rate_id: z.string().nullable().optional(),
});

const responseSchema = checkoutSummarySchema;

export type ICalculateCheckoutSummaryRequest = z.infer<typeof bodySchema>;
export type ICalculateCheckoutSummaryResponse = z.infer<typeof responseSchema>;

export const calculateCheckoutSummarySchema: FastifySchema = {
	tags: ['Checkout'],
	summary: 'Calculate checkout summary from active cart',
	description:
		"Calculates the current checkout price summary for the authenticated user's active cart. A shipping rate (`shipping_rate_id`) may optionally be provided to include freight in the calculation. This operation does not create or persist an order or payment.",
	security: [{ cookieAuth: [] }],
	body: bodySchema,
	response: {
		200: responseSchema,
		400: getBadRequestErrorSchema.startWith('BAD_REQUEST_ERROR').include('EMPTY_CART').getErrorSchema(),
		404: getNotFoundErrorSchema.startWith('RESOURCE_NOT_FOUND_ERROR').include('ACTIVE_CART_NOT_FOUND').getErrorSchema(),
	},
};
