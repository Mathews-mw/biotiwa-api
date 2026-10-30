import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { affiliateStatusSchema } from '@/domains/main/models/entities/affiliate';
import { getBadRequestErrorSchema, getForbiddenErrorSchema, getNotFoundErrorSchema } from '../erros/erros-schemas';

const paramsSchema = z.object({
	affiliateId: z.string(),
});

const bodySchema = z.object({
	decision: z.enum(['APPROVE', 'REJECT']),
});

const responseSchema = z.object({
	message: z.string(),
	affiliate: z.object({
		id: z.string(),
		status: affiliateStatusSchema,
	}),
});

export type IApprovalAffiliateRegistrationRequest = z.infer<typeof bodySchema>;
export type IApprovalAffiliateRegistrationParams = z.infer<typeof paramsSchema>;
export type IApprovalAffiliateRegistrationResponse = z.infer<typeof responseSchema>;

export const approvalAffiliateRegistrationSchema: FastifySchema = {
	tags: ['Admin'],
	summary: 'Aprove or reject an affiliate registration',
	security: [{ cookieAuth: [] }],
	params: paramsSchema,
	body: bodySchema,
	response: {
		200: responseSchema,
		400: getBadRequestErrorSchema
			.startWith('BAD_REQUEST_ERROR')
			.include('AFFILIATE_REGISTRATION_ALREADY_REVIEWED')
			.getErrorSchema(),
		403: getForbiddenErrorSchema.startWith('FORBIDDEN_ERROR').include('INSUFFICIENT_PERMISSION_ERROR').getErrorSchema(),
		404: getNotFoundErrorSchema.startWith('RESOURCE_NOT_FOUND_ERROR').include('AFFILIATE_NOT_FOUND').getErrorSchema(),
	},
};
