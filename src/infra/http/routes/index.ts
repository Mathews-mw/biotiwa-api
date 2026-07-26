import { FastifyInstance } from 'fastify';

import { usersRoutes } from './users-routes';
import { healthCheckApi } from './health-check-api';
import { betterAuthRoutesHandler } from './handlers/better-auth-routes-handler';

export async function routes(app: FastifyInstance) {
	app.register(betterAuthRoutesHandler);

	app.register(healthCheckApi, { prefix: '/' });

	app.register(usersRoutes, { prefix: '/users' });
}
