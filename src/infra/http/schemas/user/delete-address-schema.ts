import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';
import { resourceNotFoundErrorSchema } from '../erros/erros-schemas';

const paramsSchema = z.object({
	addressId: z.coerce.string(),
});

export type IDeleteAddressParams = z.infer<typeof paramsSchema>;

export const deleteAddressSchema: FastifySchema = {
	tags: ['Users'],
	summary: 'Delete user address',
	security: [{ cookieAuth: [] }],
	params: paramsSchema,
	response: {
		204: z.void(),
		404: resourceNotFoundErrorSchema,
	},
};
