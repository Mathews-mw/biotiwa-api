import { z } from 'zod';

import { orderSchema } from './order-schema';
import { orderCustomerSchema } from './order-customer-schema';
import { orderPromotionSchema } from './order-promotion-schema';
import { orderItemDetailsSchema } from './order-item-details-schema';
import { orderShippingRateSchema } from './order-shipping-rate-schema';
import { orderShippingAddressSchema } from './order-shipping-address-schema';

export const orderDetailsSchema = orderSchema.extend({
	order_customer: orderCustomerSchema.nullable().optional(),
	order_shipping_address: orderShippingAddressSchema.nullable().optional(),
	order_shipping_rate: orderShippingRateSchema.nullable().optional(),
	order_promotion: orderPromotionSchema.nullable().optional(),
	items: z.array(orderItemDetailsSchema),
});

export type IOrderDetailsResponseSchema = z.infer<typeof orderDetailsSchema>;
