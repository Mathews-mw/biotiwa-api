import { z } from 'zod';

import { shippingProviderSchema } from '@/domains/main/models/entities/shipping-quote-rate';

export const checkoutShippingSummarySchema = z.object({
	rate_id: z.string(),
	provider: shippingProviderSchema,
	service_name: z.string(),
	carrier_name: z.string().nullable().optional(),
	amount: z.coerce.number(),
	estimated_days: z.coerce.number().nullable().optional(),
});

export type ICheckoutShippingSummaryResponseSchema = z.infer<typeof checkoutShippingSummarySchema>;
