import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { checkoutSessionSchema } from './checkout-session-schema';
import { getBadRequestErrorSchema, getNotFoundErrorSchema } from '../erros/erros-schemas';
import { countryCodeSchema } from '@/core/types/country-code';

const bodySchema = z.object({
	customer: z.object({
		name: z.string().min(1),
		email: z.email(),
		phone: z.string().optional().nullable(),
		document: z.string().optional().nullable(),
		birth_date: z.string().optional().nullable(),
	}),
	shipping_address: z.object({
		zip_code: z.string().min(1),
		street: z.string().min(1),
		number: z.string().optional().nullable(),
		complement: z.string().optional().nullable(),
		district: z.string().optional().nullable(),
		city: z.string().min(1),
		state: z.string().min(1),
		country_code: countryCodeSchema,
	}),
});

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
