import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { addressSchema } from './address-schema';
import { marketCodeSchema } from '@/core/types/market-code';
import { getNotFoundErrorSchema } from '../erros/erros-schemas';

const paramsSchema = z.object({
	addressId: z.coerce.string(),
});
const bodySchema = z.object({
	market: marketCodeSchema.optional(),
	label: z.string().optional(),
	recipient: z.string().optional(),
	postal_code: z.string(),
	address_line_1: z.string(),
	number: z.string().optional(),
	address_line_2: z.string().optional(),
	district: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	country: z.string().optional(),
});

const responseSchema = z.object({
	message: z.string(),
	address: addressSchema,
});

export type IUpdateAddressParams = z.infer<typeof paramsSchema>;
export type IUpdateAddressRequest = z.infer<typeof bodySchema>;
export type IUpdateAddressResponse = z.infer<typeof responseSchema>;

export const updateAddressSchema: FastifySchema = {
	tags: ['Users'],
	summary: 'Update user address',
	security: [{ cookieAuth: [] }],
	params: paramsSchema,
	body: bodySchema,
	response: {
		200: responseSchema,
		404: getNotFoundErrorSchema.startWith('RESOURCE_NOT_FOUND_ERROR').include('ADDRESS_NOT_FOUND').getErrorSchema(),
	},
};
