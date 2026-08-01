import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { userSchema } from '../user/user-schema';

const bodySchema = z.object({
	email: z.email(),
	password: z.string(),
});

const responseSchema = z.object({
	message: z.string(),
	user: userSchema,
});

export type AuthenticateUserRequest = z.infer<typeof bodySchema>;
export type AuthenticateUserResponse = z.infer<typeof responseSchema>;

export const authenticateUserSchema: FastifySchema = {
	tags: ['Sessions'],
	summary: 'Authenticate with e-mail and password',
	body: bodySchema,
	response: {
		200: responseSchema,
	},
};
