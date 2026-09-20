import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { calculateCheckoutSummarySchema } from '../schemas/checkout/calculate-checkout-summary-schema';
import { getCheckoutSessionStatusSchema } from '../schemas/checkout/get-checkout-session-status-schema';
import { createCheckoutSessionController } from '../controllers/checkout/create-checkout-session-controller';
import { calculateCheckoutSummaryController } from '../controllers/checkout/calculate-checkout-summary-controller';
import { getCheckoutSessionStatusController } from '../controllers/checkout/get-checkout-session-status-controller';
import {
	createCheckoutSessionSchema,
	type ICreateCheckoutSessionRequest,
} from '../schemas/checkout/create-checkout-session-schema';

export async function checkoutRoutes(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.post(
			'/summary',
			{ preHandler: [authMiddleware], schema: calculateCheckoutSummarySchema },
			calculateCheckoutSummaryController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.post<{ Body: ICreateCheckoutSessionRequest }>(
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
