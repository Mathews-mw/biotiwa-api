import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { getPublicOffersController } from '../controllers/commerce/get-public-offers-controller';
import { getPublicOffersSchema } from '../schemas/commerce/get-public-offers-schema';

export async function commerceRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get('/offers', { schema: getPublicOffersSchema }, getPublicOffersController);
}
