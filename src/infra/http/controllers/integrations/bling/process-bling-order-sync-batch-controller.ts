import { z } from 'zod';
import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { ProcessBlingOrderSyncBatchUseCase } from '@/domains/main/application/modules/integrations/bling/use-cases/process-bling-order-sync-batch-use-case';

export const processBlingOrderSyncBatchBodySchema = z.object({
	limit: z.number().int().min(1).max(20).default(5),
});

type ProcessBlingOrderSyncBatchRequest = FastifyRequest<{
	Body: z.infer<typeof processBlingOrderSyncBatchBodySchema>;
}>;

export async function processBlingOrderSyncBatchController(
	request: ProcessBlingOrderSyncBatchRequest,
	reply: FastifyReply
) {
	const useCase = container.resolve(ProcessBlingOrderSyncBatchUseCase);

	const result = await useCase.execute({
		limit: request.body.limit,
	});

	return reply.status(200).send({
		processed_count: result.value.processedCount,
		success_count: result.value.successCount,
		failed_count: result.value.failedCount,
		results: result.value.results.map((item) => ({
			processed: item.processed,
			sync_id: item.syncId ?? null,
			order_id: item.orderId ?? null,
			status: item.status ?? null,
			bling_order_id: item.blingOrderId ?? null,
			error: item.error ?? null,
		})),
	});
}
