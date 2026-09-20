import { inject, injectable } from 'tsyringe';

import type { IMelhorEnvioConnectionRepository } from '../repositories/melhor-envio-connection-repository';
import type { IMelhorEnvioOAuthStateRepository } from '../repositories/melhor-envio-oauth-state-repository';
import type { IMelhorEnvioAuthentication } from '@/services/melhor-envio/repositories/melhor-envio-authentication';

import { failure, success, type Outcome } from '@/core/outcome';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	code: string;
	state: string;
}

type Response = Outcome<
	BadRequestError,
	{
		connected: true;
		expiresAt: Date;
		scope?: string | null;
	}
>;

@injectable()
export class HandleMelhorEnvioOAuthCallbackUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.MELHOR_ENVIO_AUTHENTICATION)
		private readonly melhorEnvioAuthService: IMelhorEnvioAuthentication,
		@inject(DEPENDENCY_IDENTIFIERS.MELHOR_ENVIO_CONNECTION_REPOSITORY)
		private readonly melhorEnvioConnectionRepository: IMelhorEnvioConnectionRepository,
		@inject(DEPENDENCY_IDENTIFIERS.MELHOR_ENVIO_OAUTH_STATE_REPOSITORY)
		private readonly oauthStateRepository: IMelhorEnvioOAuthStateRepository
	) {}

	async execute(input: IRequest): Promise<Response> {
		const isValidState = await this.oauthStateRepository.consume(input.state);

		if (!isValidState) {
			return failure(new BadRequestError('Invalid Melhor Envio OAuth state', 'INVALID_MELHOR_ENVIO_OAUTH_STATE'));
		}

		const tokens = await this.melhorEnvioAuthService.exchangeCodeForTokens(input.code);

		const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

		await this.melhorEnvioConnectionRepository.upsertActive({
			accessToken: tokens.access_token,
			refreshToken: tokens.refresh_token,
			expiresAt,
			scope: tokens.scope ?? null,
		});

		return success({
			connected: true,
			expiresAt,
			scope: tokens.scope ?? null,
		});
	}
}
