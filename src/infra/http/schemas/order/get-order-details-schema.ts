import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { paymentSchema } from '../payment/payment-schema';
import { orderDetailsSchema } from './order-details-schema';
import { getNotFoundErrorSchema } from '../erros/erros-schemas';

const paramsSchema = z.object({
	orderId: z.string(),
});

const responseSchema = z.object({
	order: orderDetailsSchema,
	payment: paymentSchema.nullable().optional(),
});

export type IGetOrderDetailsParams = z.infer<typeof paramsSchema>;
export type IGetOrderDetailsResponse = z.infer<typeof responseSchema>;

export const getOrderDetailsSchema: FastifySchema = {
	tags: ['Orders'],
	summary: 'Get order details',
	security: [{ cookieAuth: [] }],
	params: paramsSchema,
	response: {
		200: responseSchema,
		404: getNotFoundErrorSchema
			.startWith('RESOURCE_NOT_FOUND_ERROR')
			.include('ORDER_NOT_FOUND')
			.include('PAYMENT_NOT_FOUND')
			.getErrorSchema(),
	},
};
