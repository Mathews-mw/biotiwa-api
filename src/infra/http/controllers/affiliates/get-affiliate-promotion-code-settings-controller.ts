import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { getAuthenticatedSession } from '../../helpers/get-authenticated-session';
import { AffiliateProgramSettingsPresenter } from '../../presenters/affiliate/affiliate-program-settings-presenter';
import { IGetAffiliatePromotionCodeSettingsQuery } from '../../schemas/affiliates/get-affiliate-promotion-cde-settings-schema';
import { GetAffiliatePromotionCodeSettingsUseCase } from '@/domains/main/application/modules/affiliates/use-cases/get-affiliate-promotion-code-settings-use-case';

export async function getAffiliatePromotionCodeSettingsController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);

	const { market_code } = request.query as IGetAffiliatePromotionCodeSettingsQuery;

	const service = container.resolve(GetAffiliatePromotionCodeSettingsUseCase);

	const result = await service.execute({
		userId: session.userId,
		marketCode: market_code,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const response = {
		enabled: result.value.enabled,
		active_codes: result.value.activeCodes,
		settings: AffiliateProgramSettingsPresenter.toHTTP(result.value.settings),
	};

	return reply.status(200).send(response);
}
