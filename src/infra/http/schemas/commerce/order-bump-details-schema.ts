import { z } from 'zod';

import { productSchema } from './product-schema';
import { orderBumpSchema } from './order-bump-schema';

export const orderBumpDetailsSchema = orderBumpSchema.extend({
	product: productSchema,
});

export type IOrderBumpDetailsResponseSchema = z.infer<typeof orderBumpDetailsSchema>;
