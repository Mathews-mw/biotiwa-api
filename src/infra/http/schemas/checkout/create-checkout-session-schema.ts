import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { checkoutSessionSchema } from './checkout-session-schema';
import { getBadRequestErrorSchema, getNotFoundErrorSchema } from '../erros/erros-schemas';

const bodySchema = z.null();

const responseSchema = checkoutSessionSchema;

export type ICreateCheckoutSessionRequest = z.infer<typeof bodySchema>;
export type ICreateCheckoutSessionResponse = z.infer<typeof responseSchema>;

export const createCheckoutSessionSchema: FastifySchema = {
	tags: ['Checkout'],
	summary: 'Create checkout session from active cart',
	description: 'Create checkout session from active cart',
	security: [{ cookieAuth: [] }],
	body: bodySchema,
	response: {
		201: responseSchema,
		400: getBadRequestErrorSchema
			.startWith('BAD_REQUEST_ERROR')
			.include('EMPTY_CART')
			.include('INVALID_CHECKOUT_AMOUNT')
			.getErrorSchema(),
		404: getNotFoundErrorSchema.startWith('RESOURCE_NOT_FOUND_ERROR').include('ACTIVE_CART_NOT_FOUND').getErrorSchema(),
	},
};
