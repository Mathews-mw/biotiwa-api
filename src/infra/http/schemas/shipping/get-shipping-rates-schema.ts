import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';
import { shippingRateSchema } from './shipping-rate-schema';
import { getBadRequestErrorSchema, getNotFoundErrorSchema } from '../erros/erros-schemas';

const bodySchema = z.object({
	postal_code: z.string().min(8),
});

const responseSchema = z.object({
	rates: z.array(shippingRateSchema),
});

export type IGetShippingRatesRequest = z.infer<typeof bodySchema>;
export type IGetShippingRatesResponse = z.infer<typeof responseSchema>;

export const getShippingRatesSchema: FastifySchema = {
	tags: ['Shipping'],
	summary: 'Get shipping rates for active cart',
	description: 'Get shipping rates for active cart',
	security: [{ cookieAuth: [] }],
	body: bodySchema,
	response: {
		200: responseSchema,
		400: getBadRequestErrorSchema
			.startWith('BAD_REQUEST_ERROR')
			.include('EMPTY_CART')
			.include('SHIPPING_MARKET_NOT_SUPPORTED')
			.include('CART_HAS_NO_SHIPPABLE_PRODUCTS')
			.include('MELHOR_ENVIO_AUTHENTICATION_FAILED')
			.include('MELHOR_ENVIO_SHIPPING_QUOTE_FAILED')
			.getErrorSchema(),
		404: getNotFoundErrorSchema.startWith('RESOURCE_NOT_FOUND_ERROR').include('CART_NOT_FOUND').getErrorSchema(),
	},
};
