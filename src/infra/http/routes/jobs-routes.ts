import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { internalJobAuthMiddleware } from '../middlewares/internal-job-auth-middleware';
import {
	processBlingOrderSyncBatchBodySchema,
	processBlingOrderSyncBatchController,
} from '../controllers/integrations/bling/process-bling-order-sync-batch-controller';

export async function jobsRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/bling/order-syncs/process',
		{
			preHandler: [
				internalJobAuthMiddleware,
				// adminOnlyMiddleware,
			],
			schema: {
				tags: ['Internal Jobs'],
				summary: 'Process pending Bling order syncs in batch',
				security: [{ apiKeyAuth: [] }],
				body: processBlingOrderSyncBatchBodySchema,
				response: {
					200: z.object({
						processed_count: z.number(),
						success_count: z.number(),
						failed_count: z.number(),
						results: z.array(
							z.object({
								processed: z.boolean(),
								sync_id: z.string().nullable(),
								order_id: z.string().nullable(),
								status: z.string().nullable(),
								bling_contact_id: z.string().nullable(),
								bling_order_id: z.string().nullable(),
								reason: z.string().nullable(),
								error: z.string().nullable(),
							})
						),
					}),
				},
			},
		},
		processBlingOrderSyncBatchController
	);
}
