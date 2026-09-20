import { inject, injectable } from 'tsyringe';

import type {
	IBlingAuthentication,
	IValidationAccessTokenRequest,
	IValidationAccessTokenResponse,
} from './repositories/bling-authentication';
import type { IBlingConnectionRepository } from '@/domains/main/application/modules/integrations/bling/repositories/bling-connection-repository';

import { env } from '@/env';
import { BlingGatewayError } from './errors/bling-gateway-error';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { readResponseBody } from '@/infra/http/helpers/read-response-body';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

type BlingTokenResponse = {
	access_token: string;
	expires_in: number;
	token_type: 'Bearer';
	scope?: string;
	refresh_token: string;
};

@injectable()
export class BlingAuthenticationService implements IBlingAuthentication {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.BLING_CONNECTION_REPOSITORY)
		private blingConnectionRepository: IBlingConnectionRepository
	) {}

	async exchangeCodeForTokens(code: string): Promise<BlingTokenResponse> {
		const body = new URLSearchParams();

		body.set('grant_type', 'authorization_code');
		body.set('code', code);

		const response = await fetch(env.BLING_TOKEN_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: '1.0',
				Authorization: `Basic ${this.getBasicAuthorizationToken()}`,
				'enable-jwt': '1', //Para obter JWT: Inclua o header enable-jwt: 1 ao obter um token por meio do endpoint POST /oauth/token. É fundamental manter este header em todas as requisições subsequentes para garantir que os tokens JWT continuem sendo emitidos após renovações (Bling docs)
			},
			body,
		});

		if (!response.ok) {
			const errorBody = await response.text();

			throw new Error(`Bling token exchange failed: ${errorBody}`);
		}

		return response.json() as Promise<BlingTokenResponse>;
	}

	async refreshAccessToken(refreshToken: string): Promise<BlingTokenResponse> {
		const body = new URLSearchParams();

		body.set('grant_type', 'refresh_token');
		body.set('refresh_token', refreshToken);

		const response = await fetch(env.BLING_TOKEN_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: '1.0',
				Authorization: `Basic ${this.getBasicAuthorizationToken()}`,
				'enable-jwt': '1',
			},
			body,
		});

		if (!response.ok) {
			const errorBody = await response.text();

			throw new Error(`Bling token refresh failed: ${errorBody}`);
		}

		return response.json() as Promise<BlingTokenResponse>;
	}

	private getBasicAuthorizationToken() {
		const credentials = `${env.BLING_CLIENT_ID}:${env.BLING_CLIENT_SECRET}`;

		return Buffer.from(credentials).toString('base64');
	}

	async getValidBlingAccessToken({
		forceRefresh,
	}: IValidationAccessTokenRequest): Promise<IValidationAccessTokenResponse> {
		const connection = await this.blingConnectionRepository.findActive();

		if (!connection) {
			throw new ResourceNotFoundError('Bling connection not found', 'BLING_CONNECTION_NOT_FOUND');
		}

		if (!forceRefresh && !connection.isExpiringSoon()) {
			return {
				accessToken: connection.accessToken,
				connectionId: connection.id.toString(),
				expiresAt: connection.expiresAt,
			};
		}

		try {
			const tokens = await this.refreshAccessToken(connection.refreshToken);

			const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

			connection.updateTokens({
				accessToken: tokens.access_token,
				refreshToken: tokens.refresh_token,
				expiresAt,
				scope: tokens.scope ?? connection.scope,
			});

			const updatedConnection = await this.blingConnectionRepository.save(connection);

			return {
				accessToken: updatedConnection.accessToken,
				connectionId: updatedConnection.id.toString(),
				expiresAt: updatedConnection.expiresAt,
			};
		} catch {
			connection.markAsError();

			await this.blingConnectionRepository.save(connection);

			throw new BadRequestError('Could not refresh Bling access token', 'BLING_TOKEN_REFRESH_FAILED');
		}
	}

	private async requestToken(body: URLSearchParams, errorMessage: string): Promise<BlingTokenResponse> {
		const response = await fetch(env.BLING_TOKEN_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json',
				Authorization: `Basic ${this.getBasicAuthorizationToken()}`,
				'enable-jwt': '1',
			},
			body,
		});

		if (!response.ok) {
			throw new BlingGatewayError(errorMessage, response.status, await readResponseBody(response));
		}

		return response.json() as Promise<BlingTokenResponse>;
	}
}
