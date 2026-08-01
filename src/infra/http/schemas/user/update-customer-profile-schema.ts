import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { marketCodeSchema } from '@/core/types/market-code';
import { customerProfileSchema } from './customer-profile-schema';
import { resourceNotFoundErrorSchema } from '../erros/erros-schemas';

const bodySchema = z.object({
	preferred_market: marketCodeSchema.optional().nullable(),
	phone: z.string().optional().nullable(),
	birth_date: z.coerce.date().optional().nullable(),
	document: z.string().optional().nullable(),
});

const responseSchema = z.object({
	message: z.string(),
	customer_profile: customerProfileSchema,
});

export type IUpdateCustomerProfileRequest = z.infer<typeof bodySchema>;
export type IUpdateCustomerProfileResponse = z.infer<typeof responseSchema>;

export const updateCustomerProfileSchema: FastifySchema = {
	tags: ['Users'],
	summary: 'Update customer profile',
	security: [{ cookieAuth: [] }],
	body: bodySchema,
	response: {
		200: responseSchema,
		404: resourceNotFoundErrorSchema,
	},
};
