import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import type {
	IApprovalAffiliateRegistrationParams,
	IApprovalAffiliateRegistrationRequest,
} from '../../schemas/affiliates/approval-affiliate-registration-schema';

import { getAuthenticatedSession } from '../../helpers/get-authenticated-session';
import { ApprovalAffiliateRegistrationUseCase } from '@/domains/main/application/modules/affiliates/use-cases/approval-affiliate-registration-use-case';

export async function approvalAffiliateRegistrationController(request: FastifyRequest, reply: FastifyReply) {
	const { affiliateId } = request.params as IApprovalAffiliateRegistrationParams;
	const { decision } = request.body as IApprovalAffiliateRegistrationRequest;

	getAuthenticatedSession(request);

	const service = container.resolve(ApprovalAffiliateRegistrationUseCase);

	const result = await service.execute({
		affiliateId,
		decision,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const approvalStatusFormatted = decision === 'APPROVE' ? 'approved' : 'rejected';

	return reply.status(200).send({
		message: `Affiliate ${approvalStatusFormatted} successfully`,
		affiliate: {
			id: result.value.affiliate.id.toString(),
			status: result.value.affiliate.status,
		},
	});
}
