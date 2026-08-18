import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { createCheckoutQuoteSchema } from '../schemas/checkout/create-checkout-quote-schema';
import { createCheckoutSessionSchema } from '../schemas/checkout/create-checkout-session-schema';
import { createCheckoutQuoteController } from '../controllers/checkout/create-checkout-quote-controller';
import { createCheckoutSessionController } from '../controllers/checkout/create-checkout-session-controller';

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
}
