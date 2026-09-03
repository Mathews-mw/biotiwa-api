import { z } from 'zod';

import { orderSchema } from './order-schema';
import { orderCustomerSchema } from './order-customer-schema';
import { orderItemDetailsSchema } from './order-item-details-schema';
import { orderShippingAddressSchema } from './order-shipping-address-schema';

export const orderDetailsSchema = orderSchema.extend({
	order_customer: orderCustomerSchema.nullable().optional(),
	order_shipping_address: orderShippingAddressSchema.nullable().optional(),
	items: z.array(orderItemDetailsSchema),
});

export type IOrderDetailsResponseSchema = z.infer<typeof orderDetailsSchema>;
