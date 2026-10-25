import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { getAuthenticatedSession } from '../../helpers/get-authenticated-session';
import { ReleaseEligibleAffiliateCommissionsUseCase } from '@/domains/main/application/modules/affiliates/use-cases/release-eligible-affiliate-commissions-use-case';

export async function releaseEligibleAffiliateCommissionsController(request: FastifyRequest, reply: FastifyReply) {
	getAuthenticatedSession(request);

	const useCase = container.resolve(ReleaseEligibleAffiliateCommissionsUseCase);

	const result = await useCase.execute();

	if (result.isFalse()) {
		throw result.value;
	}

	const { analyzedAt, releasedCount, releasedCommissions } = result.value;

	return reply.status(200).send({
		analyzed_at: analyzedAt,
		released_count: releasedCount,
		released_commissions: releasedCommissions.map((commission) => ({
			id: commission.id,
			affiliate_id: commission.affiliateId,
			order_id: commission.orderId,
			commission_amount: commission.commissionAmount,
			currency: commission.currency,
			available_at: commission.availableAt,
		})),
	});
}
