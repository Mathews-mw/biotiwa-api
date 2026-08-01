import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { createUserSchema } from '../schemas/user/create-user-schema';
import { createAddressSchema } from '../schemas/user/create-address-schema';
import { updateAddressSchema } from '../schemas/user/update-address-schema';
import { deleteAddressSchema } from '../schemas/user/delete-address-schema';
import { getUserProfileSchema } from '../schemas/user/get-user-profile-schema';
import { createUserController } from '../controllers/users/create-user-controller';
import { getUserAddressesSchema } from '../schemas/user/get-user-addresses-schema';
import { acceptConsentTermsSchema } from '../schemas/user/accept-consent-terms-schema';
import { createAddressController } from '../controllers/users/create-address-controller';
import { deleteAddressController } from '../controllers/users/delete-address-controller';
import { updateAddressController } from '../controllers/users/update-address-controller';
import { setAddressAsDefaultSchema } from '../schemas/user/set-address-as-default-schema';
import { getCurrentUserController } from '../controllers/users/get-current-user-controller';
import { createCustomerProfileSchema } from '../schemas/user/create-customer-profile-schema';
import { updateCustomerProfileSchema } from '../schemas/user/update-customer-profile-schema';
import { getUserAddressesController } from '../controllers/users/get-user-addresses-controller';
import { acceptConsentTermsController } from '../controllers/users/accept-consent-terms-controller';
import { setAddressAsDefaultController } from '../controllers/users/set-address-as-default-controller';
import { createCustomerProfileController } from '../controllers/users/create-customer-profile-controller';
import { updateCustomerProfileController } from '../controllers/users/update-customer-profile-controller';

export async function usersRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post('/register', { schema: createUserSchema }, createUserController);
	app
		.withTypeProvider<ZodTypeProvider>()
		.post('/address', { preHandler: [authMiddleware], schema: createAddressSchema }, createAddressController);
	app
		.withTypeProvider<ZodTypeProvider>()
		.post('/profile', { schema: createCustomerProfileSchema }, createCustomerProfileController);
	app
		.withTypeProvider<ZodTypeProvider>()
		.post('/consent-terms/accept', { schema: acceptConsentTermsSchema }, acceptConsentTermsController);

	app
		.withTypeProvider<ZodTypeProvider>()
		.put('/address/:addressId', { preHandler: [authMiddleware], schema: updateAddressSchema }, updateAddressController);
	app
		.withTypeProvider<ZodTypeProvider>()
		.put(
			'/profile/:profileId',
			{ preHandler: [authMiddleware], schema: updateCustomerProfileSchema },
			updateCustomerProfileController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.patch(
			'/address/:addressId/default',
			{ preHandler: [authMiddleware], schema: setAddressAsDefaultSchema },
			setAddressAsDefaultController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.delete(
			'/address/:addressId',
			{ preHandler: [authMiddleware], schema: deleteAddressSchema },
			deleteAddressController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get('/me', { preHandler: [authMiddleware], schema: getUserProfileSchema }, getCurrentUserController);
	app
		.withTypeProvider<ZodTypeProvider>()
		.get('/address', { preHandler: [authMiddleware], schema: getUserAddressesSchema }, getUserAddressesController);
}
