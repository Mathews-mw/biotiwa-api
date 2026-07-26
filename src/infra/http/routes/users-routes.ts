import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { createUserSchema } from '../schemas/user/create-user-schema';
import { createUserController } from '../controllers/users/create-user-controller';

export async function usersRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post('/register', { schema: createUserSchema }, createUserController);
	// app.withTypeProvider<ZodTypeProvider>().post('/address', { schema: createAddressSchema }, createAddressController);
	// app
	// 	.withTypeProvider<ZodTypeProvider>()
	// 	.post('/customer-profile', { schema: createCustomerProfileSchema }, createCustomerProfileController);
	// app
	// 	.withTypeProvider<ZodTypeProvider>()
	// 	.post('/consent-terms/accept', { schema: acceptConsentTermsSchema }, acceptConsentTermsController);
	// app
	// 	.withTypeProvider<ZodTypeProvider>()
	// 	.get('/me', { preHandler: [authMiddleware], schema: getUserProfileSchema }, getUserProfileController);
}
