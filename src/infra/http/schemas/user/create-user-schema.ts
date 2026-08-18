import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';
import { getBadRequestErrorSchema } from '../erros/erros-schemas';
import { consentTypeSchema } from '@/domains/main/models/entities/consent-term';

const bodySchema = z.object({
	name: z.string(),
	email: z.string(),
	image: z.string().optional(),
	password: z.string().min(8).max(128),
	user_consents: z.array(
		z.object({
			type: consentTypeSchema,
			version: z.string(),
			accepted_at: z.coerce.date().optional(),
		})
	),
});

const responseSchema = z.object({
	message: z.string(),
	user_id: z.string(),
});

export type ICreateUserRequest = z.infer<typeof bodySchema>;
export type ICreateUserResponse = z.infer<typeof responseSchema>;

export const createUserSchema: FastifySchema = {
	tags: ['Users'],
	summary: 'Create a new user',
	description: 'Create a new user',
	body: bodySchema,
	response: {
		201: responseSchema,
		400: getBadRequestErrorSchema
			.startWith('BAD_REQUEST_ERROR')
			.include('SAME_EMAIL_ERROR')
			.include('TERMS_NOT_ACCEPTED')
			.include('PRIVACY_POLICY_NOT_ACCEPTED')
			.getErrorSchema(),
	},
};
