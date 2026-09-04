import { FastifyInstance } from 'fastify';

import { cartRoutes } from './cart-routes';
import { jobsRoutes } from './jobs-routes';
import { usersRoutes } from './users-routes';
import { ordersRoutes } from './orders-routes';
import { sessionsRoutes } from './sessions-routes';
import { commerceRoutes } from './commerce-routes';
import { checkoutRoutes } from './checkout-routes';
import { webhooksRoutes } from './webhooks-routes';
import { healthCheckApi } from './health-check-api';
import { integrationsRoutes } from './integrations-routes';
import { betterAuthRoutesHandler } from './handlers/better-auth-routes-handler';

export async function routes(app: FastifyInstance) {
	app.register(betterAuthRoutesHandler);

	app.register(healthCheckApi, { prefix: '/' });

	app.register(sessionsRoutes, { prefix: '/sessions' });
	app.register(usersRoutes, { prefix: '/users' });
	app.register(commerceRoutes, { prefix: '/commerce' });
	app.register(cartRoutes, { prefix: '/cart' });
	app.register(checkoutRoutes, { prefix: '/checkout' });
	app.register(ordersRoutes, { prefix: '/orders' });

	app.register(integrationsRoutes, { prefix: '/integrations' });

	app.register(jobsRoutes, { prefix: '/internal/jobs' });

	app.register(webhooksRoutes, { prefix: '/webhooks' });
}
