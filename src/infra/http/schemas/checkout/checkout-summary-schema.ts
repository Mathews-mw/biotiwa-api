import { z } from 'zod';

import { currencyCodeSchema } from '@/core/types/currency-code';
import { cartSummaryItemSchema } from '../cart/cart-summary-item-schema';
import { checkoutShippingSummarySchema } from './checkout-shipping-summary-schema';
import { promotionCodeTypeSchema } from '@/domains/main/models/entities/promotion-code';

export const checkoutSummarySchema = z.object({
	items_amount: z.coerce.number().describe('Soma do valor de todos os itens do carrinho.'),
	order_bump_amount: z.coerce.number().describe('Soma do valor de todos os order bumps do carrinho.'),
	subtotal_amount: z.coerce
		.number()
		.describe(
			'Soma do valor de todos os itens do carrinho, incluindo o valor do order bump, mas sem considerar descontos e impostos.'
		),
	discount_amount: z.coerce.number(),
	tax_amount: z.coerce.number(),
	cart_amount: z.coerce.number().describe('Valor atual do carrinho, considerando descontos e impostos, mas sem frete.'),
	shipping_amount: z.coerce
		.number()
		.nullable()
		.optional()
		.describe('Frete escolhido. `Null` => frete ainda não calculado/selecionado; `0` => frete realmente grátis'),
	shipping: checkoutShippingSummarySchema.nullable().optional(),
	total_amount: z.coerce
		.number()
		.describe('Valor efetivamente cobrado no checkout, incluindo frete, descontos e impostos.'),
	promotion: z
		.object({
			code: z.string(),
			type: promotionCodeTypeSchema,
			discount_amount: z.coerce.number(),
		})
		.nullable()
		.optional(),
	currency: currencyCodeSchema,
	items: z.array(cartSummaryItemSchema),
});

export type ICheckoutSummaryResponseSchema = z.infer<typeof checkoutSummarySchema>;
