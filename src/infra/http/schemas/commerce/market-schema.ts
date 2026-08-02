import { z } from 'zod';

import { marketCodeSchema } from '@/core/types/market-code';
import { currencyCodeSchema } from '@/core/types/currency-code';

export const marketSchema = z.object({
	id: z.string(),
	code: marketCodeSchema,
	label: z.string(),
	locale: z.string(),
	currency: currencyCodeSchema,
	shipping_amount: z.int(),
	tax_rate: z.coerce.number().describe('Return a decimal number'),
	is_active: z.coerce.boolean(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable().optional(),
});

export type IMarketResponseSchema = z.infer<typeof marketSchema>;
