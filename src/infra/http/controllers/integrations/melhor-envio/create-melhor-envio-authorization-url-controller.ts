import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { CreateMelhorEnvioAuthorizationUrlUseCase } from '@/domains/main/application/modules/integrations/melhor-envio/use-cases/create-melhor-envio-authorization-url-use-case';

export async function createMelhorEnvioAuthorizationUrlController(request: FastifyRequest, reply: FastifyReply) {
	const useCase = container.resolve(CreateMelhorEnvioAuthorizationUrlUseCase);

	const result = await useCase.execute();

	request.log.info(
		{
			authorizationUrl: result.value.authorizationUrl,
		},
		'Melhor Envio authorization URL generated'
	);

	return reply.redirect(result.value.authorizationUrl);
}
