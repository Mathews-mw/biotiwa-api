import { z } from 'zod';

import { orderSchema } from './order-schema';
import { orderItemDetailsSchema } from './order-item-details-schema';

export const orderDetailsSchema = orderSchema.extend({
	items: z.array(orderItemDetailsSchema),
});

export type IOrderDetailsResponseSchema = z.infer<typeof orderDetailsSchema>;
