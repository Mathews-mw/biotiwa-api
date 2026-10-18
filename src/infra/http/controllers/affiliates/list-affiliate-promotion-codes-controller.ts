import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { getAuthenticatedSession } from '../../helpers/get-authenticated-session';
import { AffiliatePromotionCodeDetailsPresenter } from '../../presenters/affiliate/affiliate-promotion-code-details-presenter';
import { ListAffiliatePromotionCodesUseCase } from '@/domains/main/application/modules/affiliates/use-cases/list-affiliate-promotion-codes-use-case';

export async function listAffiliatePromotionCodesController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);

	const service = container.resolve(ListAffiliatePromotionCodesUseCase);

	const result = await service.execute({
		userId: session.userId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const response = {
		promotion_codes: result.value.affiliatePromotionCodes.map(AffiliatePromotionCodeDetailsPresenter.toHTTP),
	};

	return reply.status(200).send(response);
}
