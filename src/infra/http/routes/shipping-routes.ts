import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { createShippingQuoteSchema } from '../schemas/shipping/create-shipping-quote-schema';
import { createShippingQuoteController } from '../controllers/shipping/create-shipping-quote-controller';

export async function shippingRoutes(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.post(
			'/quotes',
			{ preHandler: [authMiddleware], schema: createShippingQuoteSchema },
			createShippingQuoteController
		);
}
