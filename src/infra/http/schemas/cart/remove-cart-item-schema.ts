import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { getNotFoundErrorSchema } from '../erros/erros-schemas';

const paramsSchema = z.object({
	cartItemId: z.coerce.string(),
});

export type IRemoveCartItemParams = z.infer<typeof paramsSchema>;

export const removeCartItemSchema: FastifySchema = {
	tags: ['Cart'],
	summary: 'Remove item from active cart',
	security: [{ cookieAuth: [] }],
	params: paramsSchema,
	response: {
		204: z.void(),
		404: getNotFoundErrorSchema.startWith('RESOURCE_NOT_FOUND_ERROR').include('CART_ITEM_NOT_FOUND').getErrorSchema(),
	},
};
