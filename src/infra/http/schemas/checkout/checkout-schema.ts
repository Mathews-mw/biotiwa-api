import { z } from 'zod';

import { checkoutQuoteSchema } from './checkout-quote-schema';

export const checkoutSchema = checkoutQuoteSchema;

export type ICheckoutResponseSchema = z.infer<typeof checkoutSchema>;
