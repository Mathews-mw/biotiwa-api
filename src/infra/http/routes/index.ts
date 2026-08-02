import { FastifyInstance } from 'fastify';

import { usersRoutes } from './users-routes';
import { sessionsRoutes } from './sessions-routes';
import { commerceRoutes } from './commerce-routes';
import { healthCheckApi } from './health-check-api';
import { betterAuthRoutesHandler } from './handlers/better-auth-routes-handler';

export async function routes(app: FastifyInstance) {
	app.register(betterAuthRoutesHandler);

	app.register(healthCheckApi, { prefix: '/' });

	app.register(sessionsRoutes, { prefix: '/sessions' });
	app.register(usersRoutes, { prefix: '/users' });
	app.register(commerceRoutes, { prefix: '/commerce' });
}
