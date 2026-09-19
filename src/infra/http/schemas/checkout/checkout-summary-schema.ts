import { z } from 'zod';

import { currencyCodeSchema } from '@/core/types/currency-code';
import { checkoutShippingSummarySchema } from './checkout-shipping-summary-schema';

export const checkoutSummarySchema = z.object({
	items_amount: z.coerce.number(),
	order_bumpAmount: z.coerce.number(),
	subtotal_amount: z.coerce.number(),
	discount_amount: z.coerce.number(),
	tax_amount: z.coerce.number(),
	cart_amount: z.coerce.number().describe('Valor atual do carrinho'),
	shipping_amount: z.coerce
		.number()
		.nullable()
		.optional()
		.describe('Frete escolhido. `Null` => frete ainda não calculado/selecionado; `0` => frete realmente grátis'),
	shipping: checkoutShippingSummarySchema.nullable().optional(),
	total_amount: z.coerce.number().describe('Valor efetivamente cobrado no checkout'),
	currency: currencyCodeSchema,
});

export type ICheckoutSummaryResponseSchema = z.infer<typeof checkoutSummarySchema>;
