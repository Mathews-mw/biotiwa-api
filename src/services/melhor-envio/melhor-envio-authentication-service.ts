import { env } from '@/env';

import type { IMelhorEnvioAuthentication, IMelhorEnvioTokenResponse } from './repositories/melhor-envio-authentication';

import { readResponseBody } from '@/infra/http/helpers/read-response-body';
import { MelhorEnvioGatewayError } from './errors/melhor-envio-gateway-error';

export class MelhorEnvioAuthenticationService implements IMelhorEnvioAuthentication {
	async exchangeCodeForTokens(code: string): Promise<IMelhorEnvioTokenResponse> {
		const body = new URLSearchParams();

		body.set('grant_type', 'authorization_code');
		body.set('client_id', env.MELHOR_ENVIO_CLIENT_ID);
		body.set('client_secret', env.MELHOR_ENVIO_CLIENT_SECRET);
		body.set('redirect_uri', env.MELHOR_ENVIO_REDIRECT_URL);
		body.set('code', code);

		return this.requestToken({ body, errorMessage: 'Melhor Envio token exchange failed' });
	}

	async refreshAccessToken(refreshToken: string): Promise<IMelhorEnvioTokenResponse> {
		const body = new URLSearchParams();

		body.set('grant_type', 'refresh_token');
		body.set('client_id', env.MELHOR_ENVIO_CLIENT_ID);
		body.set('client_secret', env.MELHOR_ENVIO_CLIENT_SECRET);
		body.set('refresh_token', refreshToken);

		return this.requestToken({ body, errorMessage: 'Melhor Envio token refresh failed' });
	}

	private async requestToken({
		body,
		errorMessage,
	}: {
		body: URLSearchParams;
		errorMessage: string;
	}): Promise<IMelhorEnvioTokenResponse> {
		const response = await fetch(`${env.MELHOR_ENVIO_API_BASE_URL}/oauth/token`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
				'User-Agent': env.MELHOR_ENVIO_USER_AGENT,
			},
			body,
		});

		const responseBody = await readResponseBody(response);

		if (!response.ok) {
			throw new MelhorEnvioGatewayError(errorMessage, response.status, responseBody);
		}

		return responseBody as IMelhorEnvioTokenResponse;
	}
}
