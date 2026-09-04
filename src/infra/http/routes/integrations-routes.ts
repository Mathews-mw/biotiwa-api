import z from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { handleBlingOAuthCallbackController } from '../controllers/integrations/bling/callback-controller';
import { createBlingAuthorizationUrlController } from '../controllers/integrations/bling/authorize-controller';
import { createBlingContactController } from '../controllers/integrations/bling/create-bling-contact-controller';
import { createBlingSalesOrderController } from '../controllers/integrations/bling/create-bling-sales-order-controller';
import { processNextBlingOrderSyncController } from '../controllers/integrations/bling/process-next-bling-order-sync-controller';
import { validateBlingConnectionStatusController } from '../controllers/integrations/bling/validate-bling-connection-status-controller';

export async function integrationsRoutes(app: FastifyInstance) {
	app.post('/admin/bling/contacts', { preHandler: [authMiddleware] }, createBlingContactController);
	app.post('/admin/bling/sales-orders', { preHandler: [authMiddleware] }, createBlingSalesOrderController);

	app.withTypeProvider<ZodTypeProvider>().post(
		'/admin/bling/order-syncs/process',
		{
			preHandler: [
				authMiddleware,
				// adminOnlyMiddleware,
			],
			schema: {
				tags: ['Bling'],
				summary: 'Process next pending Bling order sync',
				response: {
					200: z.object({
						processed: z.boolean(),
						reason: z.string().nullable(),
						sync: z
							.object({
								id: z.string(),
								order_id: z.string().optional(),
								status: z.string().optional(),
								bling_contact_id: z.string().nullable().optional(),
								bling_order_id: z.string().nullable().optional(),
							})
							.nullable(),
					}),
				},
			},
		},
		processNextBlingOrderSyncController
	);

	app.get('/bling/callback', handleBlingOAuthCallbackController);
	app.get('/bling/authorize', createBlingAuthorizationUrlController);
	// Durante o desenvolvimento a rota vai ficar publica. Mas quando for para produção, essa rota deve ser protegida
	// app.get('/bling/authorize', { preHandler: [authMiddleware] }, createBlingAuthorizationUrlController);
	app.get('/bling/status', { preHandler: [authMiddleware] }, validateBlingConnectionStatusController);
}
