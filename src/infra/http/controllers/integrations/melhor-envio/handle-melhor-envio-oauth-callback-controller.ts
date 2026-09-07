import { z } from 'zod';
import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { HandleMelhorEnvioOAuthCallbackUseCase } from '@/domains/main/application/modules/integrations/melhor-envio/use-cases/handle-melhor-envio-oauth-callback-use-case';

const melhorEnvioOAuthCallbackQuerySchema = z.object({
	code: z.string().optional(),
	state: z.string().optional(),
	error: z.string().optional(),
	error_description: z.string().optional(),
});

type HandleMelhorEnvioOAuthCallbackRequest = FastifyRequest<{
	Querystring: z.infer<typeof melhorEnvioOAuthCallbackQuerySchema>;
}>;

export async function handleMelhorEnvioOAuthCallbackController(
	request: HandleMelhorEnvioOAuthCallbackRequest,
	reply: FastifyReply
) {
	const query = melhorEnvioOAuthCallbackQuerySchema.parse(request.query);

	console.log(
		{
			hasCode: Boolean(query.code),
			hasState: Boolean(query.state),
			error: query.error,
			errorDescription: query.error_description,
		},
		'Melhor Envio OAuth callback received'
	);

	if (query.error) {
		return reply.status(400).send({
			error: 'MELHOR_ENVIO_OAUTH_ERROR',
			message: query.error_description ?? query.error,
		});
	}

	if (!query.code || !query.state) {
		return reply.status(400).send({
			error: 'MISSING_MELHOR_ENVIO_OAUTH_CODE_OR_STATE',
		});
	}

	const useCase = container.resolve(HandleMelhorEnvioOAuthCallbackUseCase);

	const result = await useCase.execute({
		code: query.code,
		state: query.state,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send({
		message: 'Melhor Envio connected successfully',
		expires_at: result.value.expiresAt.toISOString(),
		scope: result.value.scope,
	});
}
