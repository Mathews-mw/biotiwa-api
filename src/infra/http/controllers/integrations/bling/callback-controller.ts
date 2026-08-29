import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { maskState } from '@/utils/mask-state';
import { HandleBlingOAuthCallbackUseCase } from '@/domains/main/application/modules/integrations/bling/use-cases/handle-bling-oauth-callback-use-case';

type BlingCallbackRequest = FastifyRequest<{
	Querystring: {
		code?: string;
		state?: string;
		error?: string;
		error_description?: string;
	};
}>;

export async function handleBlingOAuthCallbackController(request: BlingCallbackRequest, reply: FastifyReply) {
	const { code, state, error, error_description } = request.query;

	const expectedState = request.cookies.bling_oauth_state;

	request.log.info(
		{
			host: request.headers.host,
			forwardedHost: request.headers['x-forwarded-host'],
			forwardedProto: request.headers['x-forwarded-proto'],
			hasCode: Boolean(code),
			receivedState: maskState(state),
			expectedState: maskState(expectedState),
			hasExpectedStateCookie: Boolean(expectedState),
			cookieNames: Object.keys(request.cookies ?? {}),
			blingError: error,
			blingErrorDescription: error_description,
		},
		'Bling OAuth callback received'
	);

	if (error) {
		request.log.warn(
			{
				error,
				errorDescription: error_description,
			},
			'Bling OAuth returned an error'
		);

		return reply.status(400).send({
			error: 'BLING_OAUTH_ERROR',
			message: error_description ?? error,
		});
	}

	if (!code || !state) {
		request.log.warn(
			{
				hasCode: Boolean(code),
				hasState: Boolean(state),
			},
			'Missing Bling OAuth code or state'
		);

		return reply.status(400).send({
			error: 'MISSING_BLING_OAUTH_CODE_OR_STATE',
			message: 'Missing Bling OAuth code or state',
		});
	}

	if (!expectedState) {
		request.log.warn(
			{
				host: request.headers.host,
				forwardedHost: request.headers['x-forwarded-host'],
				receivedState: maskState(state),
				cookieNames: Object.keys(request.cookies ?? {}),
			},
			'Missing Bling OAuth state cookie'
		);

		return reply.status(400).send({
			error: 'MISSING_BLING_OAUTH_STATE_COOKIE',
			message:
				'O cookie de state não foi encontrado. Em ambiente local com ngrok, inicie o fluxo de autorização usando a URL do ngrok, não localhost.',
		});
	}

	if (expectedState !== state) {
		request.log.warn(
			{
				receivedState: maskState(state),
				expectedState: maskState(expectedState),
			},
			'Invalid Bling OAuth state'
		);

		return reply.status(400).send({
			error: 'INVALID_BLING_OAUTH_STATE',
		});
	}

	const useCase = container.resolve(HandleBlingOAuthCallbackUseCase);

	const result = await useCase.execute({
		code,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	reply.clearCookie('bling_oauth_state', {
		path: '/',
	});

	return reply.status(200).send({
		message: 'Bling connected successfully',
	});
}
