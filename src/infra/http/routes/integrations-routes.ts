import { FastifyInstance } from 'fastify';

import { authMiddleware } from '../middlewares/auth-middleware';
import { handleBlingOAuthCallbackController } from '../controllers/integrations/bling/callback-controller';
import { createBlingAuthorizationUrlController } from '../controllers/integrations/bling/authorize-controller';
import { createBlingContactController } from '../controllers/integrations/bling/create-bling-contact-controller';
import { createBlingSalesOrderController } from '../controllers/integrations/bling/create-bling-sales-order-controller';
import { validateBlingConnectionStatusController } from '../controllers/integrations/bling/validate-bling-connection-status-controller';

export async function integrationsRoutes(app: FastifyInstance) {
	app.post('/bling/contacts', { preHandler: [authMiddleware] }, createBlingContactController);
	app.post('/bling/sales-orders', { preHandler: [authMiddleware] }, createBlingSalesOrderController);

	app.get('/bling/callback', handleBlingOAuthCallbackController);
	app.get('/bling/authorize', createBlingAuthorizationUrlController);
	// Durante o desenvolvimento a rota vai ficar publica. Mas quando for para produção, essa rota deve ser protegida
	// app.get('/bling/authorize', { preHandler: [authMiddleware] }, createBlingAuthorizationUrlController);
	app.get('/bling/status', { preHandler: [authMiddleware] }, validateBlingConnectionStatusController);
}
