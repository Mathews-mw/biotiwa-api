import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { marketSchema } from './market-schema';
import { productSchema } from './product-schema';
import { orderBumpSchema } from './order-bump-schema';
import { marketCodeSchema } from '@/core/types/market-code';
import { offerWithItemsSchema } from './offer-with-items-schema';

const querySchema = z.object({
	market: marketCodeSchema.optional().default('BR'),
});

const responseSchema = z.object({
	market: marketSchema,
	product: productSchema,
	offers: z.array(offerWithItemsSchema),
	order_bump: orderBumpSchema.nullable(),
});

export type IGetPublicOffersQuery = z.infer<typeof querySchema>;
export type IGetPublicOffersResponse = z.infer<typeof responseSchema>;

export const getPublicOffersSchema: FastifySchema = {
	tags: ['Commerce'],
	summary: 'Get public offers by market',
	description: 'Return a list of public offers by market',
	querystring: querySchema,
	response: {
		200: responseSchema,
	},
};
