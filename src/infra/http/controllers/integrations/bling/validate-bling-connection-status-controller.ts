import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { getAuthenticatedSession } from '@/infra/http/helpers/get-authenticated-session';
import { GetValidBlingAccessTokenUseCase } from '@/domains/main/application/modules/integrations/bling/use-cases/get-valid-bling-access-token-use-case';

interface IRequest {
	force_refresh?: boolean;
}

export async function validateBlingConnectionStatusController(request: FastifyRequest, reply: FastifyReply) {
	getAuthenticatedSession(request);

	const { force_refresh } = request.query as IRequest;

	const service = container.resolve(GetValidBlingAccessTokenUseCase);

	const result = await service.execute({
		forceRefresh: force_refresh, // vai forçar o Bling a fazer o refresh token e gerar um novo sendo valido pelos próximos 30 dias
	});

	if (result.isFalse()) {
		throw result.value;
	}

	// Apenas para debug. REMOVER em produção
	console.log('Access token: ', result.value.accessToken);

	return reply.status(200).send({
		connected: true,
		connection_id: result.value.connectionId,
		expires_at: result.value.expiresAt.toISOString(),
	});
}
