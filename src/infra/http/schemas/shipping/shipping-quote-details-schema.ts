import z from 'zod';

import { shippingQuoteSchema } from './shipping-quote.schema';
import { shippingQuoteRateSchema } from './shipping-quote-rate.schema';

export const shippingQuoteDetailsSchema = z.object({
	quote: shippingQuoteSchema,
	rates: z.array(shippingQuoteRateSchema),
});

export type IShippingQuoteDetailsResponseSchema = z.infer<typeof shippingQuoteDetailsSchema>;
