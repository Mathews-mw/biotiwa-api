import { z } from 'zod';
import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { getAuthenticatedSession } from '@/infra/http/helpers/get-authenticated-session';
import { CreateBlingSalesOrderUseCase } from '@/domains/main/application/modules/integrations/bling/use-cases/create-bling-sales-order-use-case';

export const createBlingSalesOrderBodySchema = z.object({
	contact: z.object({
		id: z.number(),
		name: z.string().min(1),
		document: z.string().optional().nullable(),
		person_type: z.enum(['F', 'J', 'E']).default('F'),
	}),

	items: z
		.array(
			z.object({
				sku: z.string().min(1),
				name: z.string().min(1),
				quantity: z.number().positive(),
				unit_amount: z.number().int().positive(),
				discount_amount: z.number().int().optional(),
			})
		)
		.min(1),

	shipping_amount: z.number().int().optional(),
	discount_amount: z.number().int().optional(),
	external_order_id: z.string().min(1),
	notes: z.string().optional().nullable(),
});

export async function createBlingSalesOrderController(request: FastifyRequest, reply: FastifyReply) {
	getAuthenticatedSession(request);

	const validationResult = createBlingSalesOrderBodySchema.safeParse(request.body);

	if (!validationResult.success) {
		return reply.status(400).send({ message: 'Validation error' });
	}

	const requestInput = validationResult.data;

	const service = container.resolve(CreateBlingSalesOrderUseCase);

	const result = await service.execute({
		contact: {
			id: requestInput.contact.id,
			name: requestInput.contact.name,
			document: requestInput.contact.document,
			personType: requestInput.contact.person_type,
		},
		items: requestInput.items.map((item) => ({
			sku: item.sku,
			name: item.name,
			quantity: item.quantity,
			unitAmount: item.unit_amount,
			discountAmount: item.discount_amount,
		})),
		shippingAmount: requestInput.shipping_amount,
		discountAmount: requestInput.discount_amount,
		externalOrderId: requestInput.external_order_id,
		notes: requestInput.notes,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(201).send({
		bling_sales_order: {
			id: result.value.blingSalesOrderId,
		},
	});
}
