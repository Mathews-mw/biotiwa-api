import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { getNotFoundErrorSchema } from '../erros/erros-schemas';
import { checkoutSessionStatusSchema } from './checkout-session-status-schema';

const paramsSchema = z.object({
	providerSessionId: z.string(),
});

const responseSchema = checkoutSessionStatusSchema;

export type IGetCheckoutSessionStatusParams = z.infer<typeof paramsSchema>;
export type IGetCheckoutSessionStatusResponse = z.infer<typeof responseSchema>;

export const getCheckoutSessionStatusSchema: FastifySchema = {
	tags: ['Checkout'],
	summary: 'Get checkout session status',
	description: 'Get checkout session status',
	security: [{ cookieAuth: [] }],
	params: paramsSchema,
	response: {
		200: responseSchema,
		404: getNotFoundErrorSchema
			.startWith('RESOURCE_NOT_FOUND_ERROR')
			.include('CHECKOUT_SESSION_NOT_FOUND')
			.getErrorSchema(),
	},
};
