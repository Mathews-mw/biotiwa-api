import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { countryCodeSchema } from '@/core/types/country-code';
import { checkoutSessionSchema } from './checkout-session-schema';
import { getBadRequestErrorSchema, getNotFoundErrorSchema } from '../erros/erros-schemas';

const bodySchema = z.object({
	shipping_rate_id: z.string().min(1),
	promotion_code: z.string().trim().nullable().optional(),
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
	description:
		'Validates the current cart, shipping rate and customer information, persists the order and payment state, and creates the external payment checkout session.',
	security: [{ cookieAuth: [] }],
	body: bodySchema,
	response: {
		201: responseSchema,
		400: getBadRequestErrorSchema
			.startWith('BAD_REQUEST_ERROR')
			.include('EMPTY_CART')
			.include('INVALID_CHECKOUT_AMOUNT')
			.include('PROMOTION_CODE_INACTIVE')
			.include('PROMOTION_CODE_MARKET_MISMATCH')
			.include('PROMOTION_CODE_NOT_STARTED')
			.include('PROMOTION_CODE_EXPIRED')
			.include('PROMOTION_CODE_USAGE_LIMIT_REACHED')
			.include('PROMOTION_CODE_CUSTOMER_USAGE_LIMIT_REACHED')
			.include('SHIPPING_QUOTE_EXPIRED')
			.include('SHIPPING_RATE_MARKET_MISMATCH')
			.include('SHIPPING_RATE_CART_MISMATCH')
			.include('AFFILIATE_NOT_ACTIVE')
			.include('AFFILIATE_PROGRAM_NOT_ACTIVE')
			.include('AFFILIATE_SELF_REDEMPTION_NOT_ALLOWED')
			.getErrorSchema(),
		404: getNotFoundErrorSchema
			.startWith('RESOURCE_NOT_FOUND_ERROR')
			.include('ACTIVE_CART_NOT_FOUND')
			.include('PROMOTION_CODE_NOT_FOUND')
			.include('SHIPPING_RATE_NOT_FOUND')
			.include('AFFILIATE_PROMOTION_NOT_FOUND')
			.include('AFFILIATE_PROGRAM_SETTINGS_NOT_FOUND')
			.getErrorSchema(),
	},
};
