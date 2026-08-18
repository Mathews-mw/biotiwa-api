import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { getBadRequestErrorSchema, getNotFoundErrorSchema } from '../erros/erros-schemas';

const paramsSchema = z.object({
	cartItemId: z.coerce.string(),
});

const bodySchema = z.object({
	quantity: z.coerce.number(),
});

const responseSchema = z.object({
	message: z.string(),
});

export type IUpdateCartItemQuantityParams = z.infer<typeof paramsSchema>;
export type IUpdateCartItemQuantityRequest = z.infer<typeof bodySchema>;
export type IUpdateCartItemQuantityResponse = z.infer<typeof responseSchema>;

export const updateCartItemQuantitySchema: FastifySchema = {
	tags: ['Cart'],
	summary: 'Update cart item quantity',
	security: [{ cookieAuth: [] }],
	params: paramsSchema,
	body: bodySchema,
	response: {
		200: responseSchema,
		400: getBadRequestErrorSchema.startWith('BAD_REQUEST_ERROR').include('CART_QUANTITY_ZERO_ERROR').getErrorSchema(),
		404: getNotFoundErrorSchema.startWith('RESOURCE_NOT_FOUND_ERROR').include('CART_ITEM_NOT_FOUND').getErrorSchema(),
	},
};
