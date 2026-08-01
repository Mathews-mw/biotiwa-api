import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';
import { userProfileSchema } from './user-profile-scheme';

const responseSchema = userProfileSchema;

export type GetUserProfileResponse = z.infer<typeof responseSchema>;

export const getUserProfileSchema: FastifySchema = {
	tags: ['Users'],
	summary: 'Get user profile',
	description: 'User needs to be authenticated to get profile info',
	security: [{ cookieAuth: [] }],
	response: {
		200: responseSchema,
	},
};
