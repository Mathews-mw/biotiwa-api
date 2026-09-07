import crypto from 'node:crypto';
import { inject, injectable } from 'tsyringe';

import type { IMelhorEnvioOAuthStateRepository } from '../repositories/melhor-envio-oauth-state-repository';

import { env } from '@/env';
import { success, type Outcome } from '@/core/outcome';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

type Response = Outcome<
	never,
	{
		authorizationUrl: string;
		state: string;
	}
>;

@injectable()
export class CreateMelhorEnvioAuthorizationUrlUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.MELHOR_ENVIO_OAUTH_STATE_REPOSITORY)
		private readonly oauthStateRepository: IMelhorEnvioOAuthStateRepository
	) {}

	async execute(): Promise<Response> {
		const state = crypto.randomBytes(24).toString('hex');

		await this.oauthStateRepository.create({
			state,
			expiresAt: new Date(Date.now() + 1000 * 60 * 10),
		});

		const authorizationUrl = new URL(`${env.MELHOR_ENVIO_API_BASE_URL}/oauth/authorize`);

		authorizationUrl.searchParams.set('client_id', env.MELHOR_ENVIO_CLIENT_ID);
		authorizationUrl.searchParams.set('redirect_uri', env.MELHOR_ENVIO_REDIRECT_URL);
		authorizationUrl.searchParams.set('response_type', 'code');
		authorizationUrl.searchParams.set('state', state);
		authorizationUrl.searchParams.set('scope', env.MELHOR_ENVIO_SCOPES);

		return success({
			authorizationUrl: authorizationUrl.toString(),
			state,
		});
	}
}
