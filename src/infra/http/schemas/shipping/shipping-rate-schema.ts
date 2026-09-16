import z from 'zod';

import { currencyCodeSchema } from '@/core/types/currency-code';
import { shippingProviderSchema } from '@/domains/main/models/entities/shipping-quote-rate';

export const shippingRateSchema = z.object({
	provider: shippingProviderSchema,
	service_id: z.string(),
	service_name: z.string(),
	carrier_name: z.string().nullable().optional(),
	amount: z.coerce.number(),
	currency: currencyCodeSchema,
	company_picture: z.string().nullable().optional(),
	estimated_days: z.coerce.number().nullable().optional(),
});

export type IShippingRateResponseSchema = z.infer<typeof shippingRateSchema>;
