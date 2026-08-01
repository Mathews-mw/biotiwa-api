import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';
import { resourceNotFoundErrorSchema } from '../erros/erros-schemas';

const paramsSchema = z.object({
	addressId: z.string(),
});

const responseSchema = z.object({
	message: z.string(),
});

export type ISetAddressAsDefaultParams = z.infer<typeof paramsSchema>;
export type ISetAddressAsDefaultResponse = z.infer<typeof responseSchema>;

export const setAddressAsDefaultSchema: FastifySchema = {
	tags: ['Users'],
	summary: 'Set user address as default',
	description: 'Note: only one address can be set as default',
	security: [{ cookieAuth: [] }],
	params: paramsSchema,
	response: {
		200: responseSchema,
		404: resourceNotFoundErrorSchema,
	},
};
