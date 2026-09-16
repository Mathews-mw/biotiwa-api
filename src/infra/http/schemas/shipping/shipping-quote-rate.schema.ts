import z from 'zod';

import { currencyCodeSchema } from '@/core/types/currency-code';
import { shippingProviderSchema } from '@/domains/main/models/entities/shipping-quote-rate';

export const shippingQuoteRateSchema = z.object({
	id: z.string(),
	shipping_quote_id: z.string(),
	provider: shippingProviderSchema,
	service_id: z.string(),
	service_name: z.string(),
	carrier_name: z.string().nullable().optional(),
	amount: z.coerce.number(),
	currency: currencyCodeSchema,
	estimated_days: z.coerce.number().nullable().optional(),
	created_at: z.coerce.date(),
});

export type IShippingQuoteRateResponseSchema = z.infer<typeof shippingQuoteRateSchema>;
