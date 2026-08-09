import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

export const clearCartSchema: FastifySchema = {
	tags: ['Cart'],
	summary: 'Clear active cart',
	security: [{ cookieAuth: [] }],
	response: {
		204: z.void(),
	},
};
