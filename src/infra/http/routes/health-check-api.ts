import { z } from 'zod';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function healthCheckApi(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/health',
		{
			schema: {
				tags: ['Health Check'],
				summary: 'Health check endpoint',
				description: 'Endpoint to check if the API is running and healthy.',
				response: {
					200: z.object({
						status: z.string(),
						message: z.string(),
						version: z.string().optional(),
					}),
				},
			},
		},
		async (_, reply) => {
			return reply.status(200).send({
				status: 'ACTIVE',
				message: 'The API is working!',
				version: process.env.npm_package_version,
			});
		}
	);
}
