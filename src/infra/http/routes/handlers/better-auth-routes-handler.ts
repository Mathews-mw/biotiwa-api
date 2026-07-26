import type { FastifyInstance } from 'fastify';
import { fromNodeHeaders } from 'better-auth/node';

import { auth } from '@/infra/auth/auth';

export async function betterAuthRoutesHandler(app: FastifyInstance) {
	app.route({
		method: ['GET', 'POST'],
		url: '/auth/*',
		async handler(request, reply) {
			const url = new URL(request.url, `${request.protocol}://${request.headers.host}`);

			const headers = fromNodeHeaders(request.headers);

			const hasBody = request.method !== 'GET' && request.method !== 'HEAD' && request.body !== undefined;

			const authRequest = new Request(url.toString(), {
				method: request.method,
				headers,
				body: hasBody ? JSON.stringify(request.body) : undefined,
			});

			const response = await auth.handler(authRequest);

			response.headers.forEach((value, key) => {
				reply.header(key, value);
			});

			reply.status(response.status);

			const body = response.body ? await response.text() : null;

			return reply.send(body);
		},
	});
}
