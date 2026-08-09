import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { clearCartSchema } from '../schemas/cart/clear-cart-schema';
import { addCartItemSchema } from '../schemas/cart/add-cart-item-schema';
import { getActiveCartSchema } from '../schemas/cart/get-active-cart-schema';
import { removeCartItemSchema } from '../schemas/cart/remove-cart-item-schema';
import { clearCartController } from '../controllers/carts/clear-cart-controller';
import { addCartItemController } from '../controllers/carts/add-cart-item-controller';
import { getActiveCartController } from '../controllers/carts/get-active-cart-controller';
import { removeCartItemController } from '../controllers/carts/remove-cart-item-controller';
import { updateCartItemQuantitySchema } from '../schemas/cart/update-cart-item-quantity-schema';
import { updateCartItemQuantityController } from '../controllers/carts/update-cart-item-quantity-controller';

export async function cartRoutes(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.post('/item/add', { preHandler: [authMiddleware], schema: addCartItemSchema }, addCartItemController);

	app
		.withTypeProvider<ZodTypeProvider>()
		.patch(
			'/item/:cartItemId/quantity',
			{ preHandler: [authMiddleware], schema: updateCartItemQuantitySchema },
			updateCartItemQuantityController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.delete('/clear', { preHandler: [authMiddleware], schema: clearCartSchema }, clearCartController);
	app
		.withTypeProvider<ZodTypeProvider>()
		.delete(
			'/item/:cartItemId/remove',
			{ preHandler: [authMiddleware], schema: removeCartItemSchema },
			removeCartItemController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get('/active', { preHandler: [authMiddleware], schema: getActiveCartSchema }, getActiveCartController);
}
