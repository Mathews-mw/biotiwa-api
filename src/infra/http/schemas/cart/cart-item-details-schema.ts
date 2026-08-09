import { z } from 'zod';

import { cartItemSchema } from './cart-item-schema';
import { productSchema } from '../commerce/product-schema';
import { offerDetailsSchema } from '../commerce/offer-details-schema';
import { orderBumpDetailsSchema } from '../commerce/order-bump-details-schema';

export const cartItemDetailsSchema = cartItemSchema.extend({
	product: productSchema.nullable(),
	offer: offerDetailsSchema.nullable(),
	order_bump: orderBumpDetailsSchema.nullable(),
});

export type ICartItemDetailsResponseSchema = z.infer<typeof cartItemDetailsSchema>;
