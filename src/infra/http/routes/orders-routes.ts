import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { getOrderDetailsSchema } from '../schemas/order/get-order-details-schema';
import { listingUserOrdersResponseSchema } from '../schemas/order/listing-user-orders-schema';
import { getOrderDetailsController } from '../controllers/orders/get-order-details-controller';
import { listingUserOrdersController } from '../controllers/orders/listing-user-orders-controller';

export async function ordersRoutes(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/user/order-history',
			{ preHandler: [authMiddleware], schema: listingUserOrdersResponseSchema },
			listingUserOrdersController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get('/:orderId', { preHandler: [authMiddleware], schema: getOrderDetailsSchema }, getOrderDetailsController);
}
