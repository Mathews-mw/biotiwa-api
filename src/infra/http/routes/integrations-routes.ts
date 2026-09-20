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
import { handleMelhorEnvioOAuthCallbackController } from '../controllers/integrations/melhor-envio/handle-melhor-envio-oauth-callback-controller';
import { createMelhorEnvioAuthorizationUrlController } from '../controllers/integrations/melhor-envio/create-melhor-envio-authorization-url-controller';

export async function integrationsRoutes(app: FastifyInstance) {
	// === Bling Routes ===
	app.post(
		'/bling/contacts',
		{
			preHandler: [
				authMiddleware,
				// adminOnlyMiddleware,
			],
		},
		createBlingContactController
	);
	app.post(
		'/bling/sales-orders',
		{
			preHandler: [
				authMiddleware,
				// adminOnlyMiddleware,
			],
		},
		createBlingSalesOrderController
	);

	app.withTypeProvider<ZodTypeProvider>().post(
		'/bling/order-syncs/process',
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

	// === Melhor Envio Routes ===
	app.withTypeProvider<ZodTypeProvider>().get(
		'/melhor-envio/authorize',
		{
			preHandler: [
				// Durante o desenvolvimento a rota vai ficar publica. Mas quando for para produção, essa rota deve ser protegida
				// authMiddleware,
				// adminOnlyMiddleware,
			],
			schema: {
				tags: ['Melhor Envio'],
				summary: 'Authorize Melhor Envio integration',
				response: {
					302: z.unknown(),
				},
			},
		},
		createMelhorEnvioAuthorizationUrlController
	);

	app.withTypeProvider<ZodTypeProvider>().get(
		'/melhor-envio/callback',
		{
			schema: {
				tags: ['Melhor Envio'],
				summary: 'Handle Melhor Envio OAuth callback',
				querystring: z.object({
					code: z.string().optional(),
					state: z.string().optional(),
					error: z.string().optional(),
					error_description: z.string().optional(),
				}),
				response: {
					200: z.object({
						message: z.string(),
						expires_at: z.string(),
						scope: z.string().nullable().optional(),
					}),
				},
			},
		},
		handleMelhorEnvioOAuthCallbackController
	);
}
