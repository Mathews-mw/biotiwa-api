import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { createCheckoutQuoteSchema } from '../schemas/checkout/create-checkout-quote-schema';
import { createCheckoutSessionSchema } from '../schemas/checkout/create-checkout-session-schema';
import { getCheckoutSessionStatusSchema } from '../schemas/checkout/get-checkout-session-status-schema';
import { createCheckoutQuoteController } from '../controllers/checkout/create-checkout-quote-controller';
import { createCheckoutSessionController } from '../controllers/checkout/create-checkout-session-controller';
import { getCheckoutSessionStatusController } from '../controllers/checkout/get-checkout-session-status-controller';

export async function checkoutRoutes(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.post('/quote', { preHandler: [authMiddleware], schema: createCheckoutQuoteSchema }, createCheckoutQuoteController);

	app
		.withTypeProvider<ZodTypeProvider>()
		.post(
			'/sessions',
			{ preHandler: [authMiddleware], schema: createCheckoutSessionSchema },
			createCheckoutSessionController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/sessions/:providerSessionId',
			{ preHandler: [authMiddleware], schema: getCheckoutSessionStatusSchema },
			getCheckoutSessionStatusController
		);
}
