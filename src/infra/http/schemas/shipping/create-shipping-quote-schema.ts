import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { shippingQuoteDetailsSchema } from './shipping-quote-details-schema';
import { getBadRequestErrorSchema, getNotFoundErrorSchema } from '../erros/erros-schemas';

const bodySchema = z.object({
	postal_code: z.string().min(8),
});

const responseSchema = shippingQuoteDetailsSchema;

export type ICreateShippingQuoteRequest = z.infer<typeof bodySchema>;
export type ICreateShippingQuoteResponse = z.infer<typeof responseSchema>;

export const createShippingQuoteSchema: FastifySchema = {
	tags: ['Shipping'],
	summary: 'Create shipping quote for active cart',
	description: 'Create shipping quote for active cart',
	security: [{ cookieAuth: [] }],
	body: bodySchema,
	response: {
		201: responseSchema,
		400: getBadRequestErrorSchema
			.startWith('BAD_REQUEST_ERROR')
			.include('EMPTY_CART')
			.include('SHIPPING_MARKET_NOT_SUPPORTED')
			.include('MELHOR_ENVIO_AUTHENTICATION_FAILED')
			.include('NO_SHIPPING_RATES_AVAILABLE')
			.getErrorSchema(),
		404: getNotFoundErrorSchema.startWith('RESOURCE_NOT_FOUND_ERROR').include('ACTIVE_CART_NOT_FOUND').getErrorSchema(),
	},
};
