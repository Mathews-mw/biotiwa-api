import { env } from '@/env';

import type { IBlingGateway } from './bling-gateway';

type BlingTokenResponse = {
	access_token: string;
	expires_in: number;
	token_type: 'Bearer';
	scope?: string;
	refresh_token: string;
};

export class BlingGatewayService implements IBlingGateway {
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

		console.log('Bling exchange token response: ', response);

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
}
