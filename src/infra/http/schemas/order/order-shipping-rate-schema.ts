import z from 'zod';

import { currencyCodeSchema } from '@/core/types/currency-code';
import { shippingProviderSchema } from '@/domains/main/models/entities/shipping-quote-rate';

export const orderShippingRateSchema = z.object({
	id: z.string(),
	order_id: z.string(),
	shipping_quote_id: z.string().nullable().optional(),
	shipping_quote_rate_id: z.string().nullable().optional(),
	provider: shippingProviderSchema,
	service_id: z.string(),
	service_name: z.string(),
	carrier_name: z.string().nullable().optional(),
	amount: z.coerce.number(),
	currency: currencyCodeSchema,
	estimated_days: z.coerce.number().nullable().optional(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type IOrderShippingRateResponseSchema = z.infer<typeof orderShippingRateSchema>;
