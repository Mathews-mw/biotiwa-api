import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { getNotFoundErrorSchema } from '../erros/erros-schemas';
import { consentTypeSchema } from '@/domains/main/models/entities/consent-term';

const bodySchema = z.object({
	user_email: z.string(),
	consents: z.array(
		z.object({
			type: consentTypeSchema,
			version: z.string(),
			accepted_at: z.coerce.date().optional(),
		})
	),
});

const responseSchema = z.object({
	message: z.string(),
});

export type IAcceptConsentTermsRequest = z.infer<typeof bodySchema>;
export type IAcceptConsentTermsResponse = z.infer<typeof responseSchema>;

export const acceptConsentTermsSchema: FastifySchema = {
	tags: ['Users'],
	summary: 'Accept consent terms',
	security: [{ cookieAuth: [] }],
	body: bodySchema,
	response: {
		201: responseSchema,
		404: getNotFoundErrorSchema.startWith('RESOURCE_NOT_FOUND_ERROR').include('USER_NOT_FOUND').getErrorSchema(),
	},
};
