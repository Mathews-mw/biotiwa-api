import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { authenticateUserSchema } from '../schemas/auth/authenticate-user-schema';
import { signOutUserController } from '../controllers/auth/sign-out-user-controller';
import { authenticateWithCredentialsController } from '../controllers/auth/authenticate-with-credentials-controller';

export async function sessionsRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/signin/credentials',
		{
			schema: authenticateUserSchema,
		},
		authenticateWithCredentialsController
	);

	// app.withTypeProvider<ZodTypeProvider>().patch(
	// 	'/refresh-token',

	// 	{
	// 		onRequest: [authMiddleware],
	// 		schema: refreshTokenSchema,
	// 	},
	// 	refreshTokenController
	// );

	app.patch(
		'/signout',
		{
			onRequest: [authMiddleware],
			schema: {
				tags: ['Sessions'],
				summary: 'Sign out current user',
				description: 'This action will clear your current tokens session',
				security: [{ cookieAuth: [] }],
				response: {
					204: z.null(),
				},
			},
		},
		signOutUserController
	);
}
