import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { getAuthenticatedSession } from '../../helpers/get-authenticated-session';
import { AffiliatePresenter } from '../../presenters/affiliate/affiliate-presenter';
import { IRegisterAffiliateRequest } from '../../schemas/affiliates/register-affiliate-schema';
import { RegisterAffiliateUseCase } from '@/domains/main/application/modules/affiliates/use-cases/register-affiliate-use-case';

export async function registerAffiliateController(request: FastifyRequest, reply: FastifyReply) {
	const { type } = request.body as IRegisterAffiliateRequest;

	const session = getAuthenticatedSession(request);

	const service = container.resolve(RegisterAffiliateUseCase);

	const result = await service.execute({
		userId: session.userId,
		type,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(201).send({
		message: 'Affiliate registered successfully',
		affiliate: AffiliatePresenter.toHTTP(result.value.affiliate),
	});
}
