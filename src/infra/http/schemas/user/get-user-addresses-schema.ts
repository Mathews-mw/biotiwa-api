import z from 'zod';
import { addressSchema } from './address-schema';
import { FastifySchema } from 'fastify/types/schema';

const querySchema = z.object({
	is_default: z.coerce.boolean().optional(),
});

const responseSchema = z.array(addressSchema);

export type IGetUserAddressesQuery = z.infer<typeof querySchema>;
export type IGetUserAddressesResponse = z.infer<typeof responseSchema>;

export const getUserAddressesSchema: FastifySchema = {
	tags: ['Users'],
	summary: 'Get user addresses',
	description: 'User needs to be authenticated to get data',
	security: [{ cookieAuth: [] }],
	querystring: querySchema,
	response: {
		200: responseSchema,
	},
};
