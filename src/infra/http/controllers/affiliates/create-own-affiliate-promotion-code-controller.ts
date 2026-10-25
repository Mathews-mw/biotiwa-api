import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { getAuthenticatedSession } from '../../helpers/get-authenticated-session';
import { ICreateOwnAffiliatePromotionCodeRequest } from '../../schemas/affiliates/create-own-affiliate-promotion-code-schema';
import { AffiliatePromotionCodeDetailsPresenter } from '../../presenters/affiliate/affiliate-promotion-code-details-presenter';
import { CreateOwnAffiliatePromotionCodeUseCase } from '@/domains/main/application/modules/affiliates/use-cases/create-own-affiliate-promotion-code-use-case';

export async function createOwnAffiliatePromotionCodeController(request: FastifyRequest, reply: FastifyReply) {
	const { code, expires_in_days, market_code, max_uses_per_customer } =
		request.body as ICreateOwnAffiliatePromotionCodeRequest;

	const session = getAuthenticatedSession(request);

	const service = container.resolve(CreateOwnAffiliatePromotionCodeUseCase);

	const result = await service.execute({
		userId: session.userId,
		code,
		expiresInDays: expires_in_days,
		marketCode: market_code,
		maxUsesPerCustomer: max_uses_per_customer,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(201).send({
		message: 'Affiliate promotion code created successfully',
		affiliate_promotion_code: AffiliatePromotionCodeDetailsPresenter.toHTTP(result.value.affiliatePromotionCode),
	});
}
