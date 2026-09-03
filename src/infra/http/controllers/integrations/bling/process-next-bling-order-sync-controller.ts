import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { ProcessNextBlingOrderSyncUseCase } from '@/domains/main/application/modules/integrations/bling/use-cases/process-next-bling-order-sync-use-case';

export async function processNextBlingOrderSyncController(_request: FastifyRequest, reply: FastifyReply) {
	const useCase = container.resolve(ProcessNextBlingOrderSyncUseCase);

	const result = await useCase.execute();

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send({
		processed: result.value.processed,
		reason: result.value.reason ?? null,
		sync: result.value.syncId
			? {
					id: result.value.syncId,
					order_id: result.value.orderId,
					status: result.value.status,
					bling_contact_id: result.value.blingContactId,
					bling_order_id: result.value.blingOrderId,
				}
			: null,
	});
}
