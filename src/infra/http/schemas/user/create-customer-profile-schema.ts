import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { marketCodeSchema } from '@/core/types/market-code';

const bodySchema = z.object({
	user_id: z.string(),
	preferred_market: marketCodeSchema.optional(),
	phone: z.string().optional(),
	birth_date: z.coerce.date().optional(),
});

const responseSchema = z.object({
	message: z.string(),
	customer_profile_id: z.uuid(),
});

export type ICreateCustomerProfileRequest = z.infer<typeof bodySchema>;
export type ICreateCustomerProfileResponse = z.infer<typeof responseSchema>;

export const createCustomerProfileSchema: FastifySchema = {
	tags: ['Users'],
	summary: 'Create a new customer profile',
	security: [{ cookieAuth: [] }],
	body: bodySchema,
	response: {
		201: responseSchema,
	},
};
