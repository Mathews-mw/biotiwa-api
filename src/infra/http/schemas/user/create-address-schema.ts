import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { marketCodeSchema } from '@/core/types/market-code';

const bodySchema = z.object({
	market: marketCodeSchema,
	label: z.string().optional(),
	recipient: z.string().optional(),
	postal_code: z.string(),
	address_line_1: z.string(),
	number: z.string().optional(),
	address_line_2: z.string().optional(),
	district: z.string().optional(),
	city: z.string(),
	state: z.string(),
	country: z.string(),
	is_default: z.coerce.boolean().optional(),
});

const responseSchema = z.object({
	message: z.string(),
	address_id: z.uuid(),
});

export type ICreateAddressRequest = z.infer<typeof bodySchema>;
export type ICreateAddressResponse = z.infer<typeof responseSchema>;

export const createAddressSchema: FastifySchema = {
	tags: ['Users'],
	summary: 'Create a new address',
	security: [{ cookieAuth: [] }],
	body: bodySchema,
	response: {
		201: responseSchema,
	},
};
