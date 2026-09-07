import { inject, injectable } from 'tsyringe';

import type { IMelhorEnvioConnectionRepository } from '../repositories/melhor-envio-connection-repository';
import type { IMelhorEnvioAuthentication } from '@/services/melhor-envio/repositories/melhor-envio-authentication';

import { failure, success, type Outcome } from '@/core/outcome';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	forceRefresh?: boolean;
}

type Response = Outcome<
	ResourceNotFoundError | BadRequestError,
	{
		accessToken: string;
		expiresAt: Date;
		scope?: string | null;
	}
>;

@injectable()
export class GetValidMelhorEnvioAccessTokenUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.MELHOR_ENVIO_AUTHENTICATION)
		private readonly melhorEnvioAuthService: IMelhorEnvioAuthentication,
		@inject(DEPENDENCY_IDENTIFIERS.MELHOR_ENVIO_CONNECTION_REPOSITORY)
		private readonly melhorEnvioConnectionRepository: IMelhorEnvioConnectionRepository
	) {}

	async execute({ forceRefresh = false }: IRequest = {}): Promise<Response> {
		const connection = await this.melhorEnvioConnectionRepository.findActive();

		if (!connection) {
			return failure(
				new ResourceNotFoundError('Melhor Envio connection not found', 'MELHOR_ENVIO_CONNECTION_NOT_FOUND')
			);
		}

		if (!forceRefresh && !connection.isExpiringSoon()) {
			return success({
				accessToken: connection.accessToken,
				expiresAt: connection.expiresAt,
				scope: connection.scope,
			});
		}

		try {
			const tokens = await this.melhorEnvioAuthService.refreshAccessToken(connection.refreshToken);

			const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

			connection.updateTokens({
				accessToken: tokens.access_token,
				refreshToken: tokens.refresh_token,
				expiresAt,
				scope: tokens.scope ?? connection.scope,
			});

			const updatedConnection = await this.melhorEnvioConnectionRepository.save(connection);

			return success({
				accessToken: updatedConnection.accessToken,
				expiresAt: updatedConnection.expiresAt,
				scope: updatedConnection.scope,
			});
		} catch {
			connection.markAsError();

			await this.melhorEnvioConnectionRepository.save(connection);

			return failure(
				new BadRequestError('Could not refresh Melhor Envio access token', 'MELHOR_ENVIO_TOKEN_REFRESH_FAILED')
			);
		}
	}
}
