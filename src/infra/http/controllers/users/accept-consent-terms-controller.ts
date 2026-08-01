import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { IAcceptConsentTermsRequest } from '../../schemas/user/accept-consent-terms-schema';
import { AcceptConsentTermsUseCase } from '@/domains/main/application/modules/users/use-cases/accept-consent-terms-use-case';

export async function acceptConsentTermsController(request: FastifyRequest, reply: FastifyReply) {
	const { user_email, consents } = request.body as IAcceptConsentTermsRequest;

	const service = container.resolve(AcceptConsentTermsUseCase);

	const ipAddress = request.ip ?? null;
	const userAgent = request.headers['user-agent'] ?? null;

	const result = await service.execute({
		userEmail: user_email,
		consents: consents.map((item) => {
			return {
				type: item.type,
				version: item.version,
				acceptedAt: item.accepted_at,
			};
		}),
		ipAddress,
		userAgent,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(201).send({
		message: 'Operation successfully completed',
	});
}
