import { z } from 'zod';
import { orderDetailsSchema } from './order-details-schema';
import { currencyCodeSchema } from '@/core/types/currency-code';
import { orderStatusSchema } from '@/domains/main/models/entities/order';
import { paymentProviderSchema, paymentStatusSchema } from '@/domains/main/models/entities/payment';

export const checkoutSessionStatusSchema = z.object({
	provider_session_id: z.string().nullable().optional(),
	payment_provider: paymentProviderSchema,
	payment_status: paymentStatusSchema,
	order_id: z.string(),
	order_status: orderStatusSchema,
	currency: currencyCodeSchema,
	amount: z.coerce.number(),
	is_paid: z.coerce.boolean(),
	is_pending: z.coerce.boolean(),
	is_failed: z.coerce.boolean(),
	is_expired: z.coerce.boolean(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
	order: orderDetailsSchema,
});

export type ICheckoutSessionStatusResponseSchema = z.infer<typeof checkoutSessionStatusSchema>;
