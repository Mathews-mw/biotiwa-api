import { FastifyInstance } from 'fastify';

import { handleBlingOAuthCallbackController } from '../controllers/integrations/bling/callback-controller';
import { createBlingAuthorizationUrlController } from '../controllers/integrations/bling/authorize-controller';

export async function integrationsRoutes(app: FastifyInstance) {
	app.get('/bling/callback', handleBlingOAuthCallbackController);
	app.get('/bling/authorize', createBlingAuthorizationUrlController);
}
