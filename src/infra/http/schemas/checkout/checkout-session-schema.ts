import { z } from 'zod';

import { orderDetailsSchema } from './order-details-schema';
import { currencyCodeSchema } from '@/core/types/currency-code';
import { orderStatusSchema } from '@/domains/main/models/entities/order';
import { paymentProviderSchema } from '@/domains/main/models/entities/payment';

export const checkoutSessionSchema = z.object({
	order_id: z.string(),
	status: orderStatusSchema,
	amount: z.number(),
	currency: currencyCodeSchema,
	payment_url: z.string().nullable().optional(),
	payment_provider: paymentProviderSchema.nullable().optional(),
	provider_session_id: z.string().nullable().optional(),
	provider_payment_intent: z.string().nullable().optional(),
	created_at: z.coerce.date(),
	order: orderDetailsSchema,
});

export type ICheckoutSessionResponseSchema = z.infer<typeof checkoutSessionSchema>;
