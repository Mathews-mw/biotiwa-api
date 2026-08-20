import 'reflect-metadata';
import '@/shared/di/containers/index';

import fastify from 'fastify';
import rawBody from 'fastify-raw-body';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import { env } from '@/env';
import { routes } from './http/routes';
import { errorHandler } from './error-handler';
import { prismaPlugin } from './plugins/prisma-plugin';

export const app = fastify({ logger: true, trustProxy: true }).withTypeProvider<ZodTypeProvider>();

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

await app.register(rawBody, {
	field: 'rawBody', // change the default request.rawBody property name
	global: false, // Turn off global capturing to save memory
	encoding: 'utf8', // set it to false to set rawBody as a Buffer
	runFirst: true, // get the body before any preParsing hook change/uncompress it
	routes: [], // array of routes, **`global`** will be ignored, wildcard routes not supported
	jsonContentTypes: [], // array of content-types to handle as JSON. **Default ['application/json']**
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
// app.addHook('onRequest', (request, reply, done) => {
// 	console.log(
// 		`[Method: ${request.method}] - [Protocol: ${request.protocol}] - [Url: ${request.url}] - [timestamp: ${new Date()}]`
// 	);
// 	done();
// });

app.register(prismaPlugin);
app.register(routes, { prefix: '/api' });
