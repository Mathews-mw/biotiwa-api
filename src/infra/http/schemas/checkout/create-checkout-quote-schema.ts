import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { checkoutQuoteSchema } from './checkout-quote-schema';
import { getBadRequestErrorSchema, getNotFoundErrorSchema } from '../erros/erros-schemas';

const bodySchema = z.null();

const responseSchema = checkoutQuoteSchema;

export type ICreateCheckoutQuoteRequest = z.infer<typeof bodySchema>;
export type ICreateCheckoutQuoteResponse = z.infer<typeof responseSchema>;

export const createCheckoutQuoteSchema: FastifySchema = {
	tags: ['Checkout'],
	summary: 'Create checkout quote from active cart',
	description: 'Create checkout quote from active cart',
	security: [{ cookieAuth: [] }],
	body: bodySchema,
	response: {
		200: responseSchema,
		400: getBadRequestErrorSchema
			.startWith('BAD_REQUEST_ERROR')
			.include('EMPTY_CART')
			.include('INVALID_CHECKOUT_AMOUNT')
			.getErrorSchema(),
		404: getNotFoundErrorSchema.startWith('RESOURCE_NOT_FOUND_ERROR').include('ACTIVE_CART_NOT_FOUND').getErrorSchema(),
	},
};
