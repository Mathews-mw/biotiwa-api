import 'reflect-metadata';
import '@/shared/di/containers/index';

import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import { env } from '@/env';
import { routes } from './http/routes';
import { errorHandler } from './error-handler';

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCookie);

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Bio Tiwa API',
			description: 'An API from Bio Tiwa Services',
			version: `${process.env.npm_package_version}`,
		},
		components: {
			securitySchemes: {
				cookieAuth: {
					type: 'apiKey',
					in: 'cookie',
					name: 'better-auth.session_token',
				},
			},
		},
	},
	transform: jsonSchemaTransform,
});

app.setErrorHandler(errorHandler);

app.register(fastifySwaggerUi, {
	routePrefix: '/api/docs',
});

app.register(fastifyCors, {
	origin: [env.WEB_APP_URL],
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});

// Debug only
app.addHook('onRequest', (request, reply, done) => {
	console.log(`[Method: ${request.method}] - [Protocol: ${request.protocol}] - [Url: ${request.url}]`);
	done();
});

app.register(routes, { prefix: '/api' });
