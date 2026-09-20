import { env } from '@/env';
import { readResponseBody } from '@/infra/http/helpers/read-response-body';
import { ShippingGatewayError } from '../shipping/errors/shipping-gateway-error';

export class MelhorEnvioHelpers {
	protected async request<TResponse>(input: {
		accessToken: string;
		path: string;
		method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		body?: unknown;
		searchParams?: Record<string, string | number | boolean | undefined | null>;
	}): Promise<TResponse> {
		const url = new URL(`${env.MELHOR_ENVIO_API_BASE_URL}${input.path}`);

		if (input.searchParams) {
			for (const [key, value] of Object.entries(input.searchParams)) {
				if (value !== undefined && value !== null && value !== '') {
					url.searchParams.set(key, String(value));
				}
			}
		}

		const response = await fetch(url, {
			method: input.method,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${input.accessToken}`,
				'User-Agent': env.MELHOR_ENVIO_USER_AGENT,
			},
			body: input.body ? JSON.stringify(input.body) : undefined,
		});

		if (!response.ok) {
			throw new ShippingGatewayError(
				`Melhor Envio API request failed: ${input.method} ${input.path}`,
				response.status,
				await readResponseBody(response)
			);
		}

		return response.json() as Promise<TResponse>;
	}
}
