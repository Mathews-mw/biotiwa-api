import { z } from 'zod';

import { currencyCodeSchema } from '@/core/types/currency-code';
import { paymentProviderSchema, paymentStatusSchema, paymentTypeSchema } from '@/domains/main/models/entities/payment';

export const paymentSchema = z.object({
	id: z.string(),
	order_id: z.string(),
	provider: paymentProviderSchema,
	status: paymentStatusSchema,
	amount: z.number().int().nonnegative(),
	currency: currencyCodeSchema,
	payment_type: paymentTypeSchema,
	provider_session_id: z.string().nullable().optional(),
	provider_payment_intent: z.string().nullable().optional(),
	provider_checkout_url: z.string().nullable().optional(),
	// raw_payload: z.unknown().nullable().optional(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type IPaymentResponseSchema = z.infer<typeof paymentSchema>;
