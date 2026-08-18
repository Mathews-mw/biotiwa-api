import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { cartDetailsSchema } from './cart-details-schema';
import { cartSummarySchema } from './cart-summary-schema';
import { marketCodeSchema } from '@/core/types/market-code';
import { getBadRequestErrorSchema, getNotFoundErrorSchema } from '../erros/erros-schemas';

const bodySchema = z.union([
	z.object({
		type: z.literal('OFFER'),
		market_code: marketCodeSchema,
		offer_id: z.string(),
		quantity: z.coerce.number().optional(),
	}),
	z.object({
		type: z.literal('ORDER_BUMP'),
		market_code: marketCodeSchema,
		order_bump_id: z.string(),
		quantity: z.coerce.number().optional(),
	}),
]);

const responseSchema = z.object({
	message: z.string(),
	cart: cartDetailsSchema.nullable(),
	summary: cartSummarySchema.nullable(),
});

export type IAddCartItemRequest = z.infer<typeof bodySchema>;
export type IAddCartItemResponse = z.infer<typeof responseSchema>;

export const addCartItemSchema: FastifySchema = {
	tags: ['Cart'],
	summary: "Add new item to the user's cart",
	description:
		'The schema accepts only `OFFER` or `ORDER_BUMP` as the cart type (`type`) option. Depending on the case, you should choose to send either `offer_id` or `order_bump_id`.',
	security: [{ cookieAuth: [] }],
	body: bodySchema,
	response: {
		200: responseSchema,
		400: getBadRequestErrorSchema
			.startWith('BAD_REQUEST_ERROR')
			.include('CART_QUANTITY_ZERO_ERROR')
			.include('CART_ITEM_DOES_NOT_BELONG_SELECT_MARKET')
			.getErrorSchema(),
		404: getNotFoundErrorSchema.startWith('RESOURCE_NOT_FOUND_ERROR').include('MARKET_CODE_NOT_FOUND').getErrorSchema(),
	},
};
