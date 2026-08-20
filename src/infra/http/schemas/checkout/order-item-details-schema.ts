import { z } from 'zod';

import { orderItemSchema } from './order-item-schema';
import { productSchema } from '../commerce/product-schema';

export const orderItemDetailsSchema = orderItemSchema.extend({
	product: productSchema.nullable().optional(),
});
export type IOrderItemDetailsResponseSchema = z.infer<typeof orderItemDetailsSchema>;
