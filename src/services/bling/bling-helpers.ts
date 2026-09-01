import { env } from '@/env';
import { BlingGatewayError } from './errors/bling-gateway-error';
import { readResponseBody } from '@/infra/http/helpers/read-response-body';

export class BlingHelpers {
	protected async request<TResponse>(input: {
		accessToken: string;
		path: string;
		method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		body?: unknown;
	}): Promise<TResponse> {
		const url = new URL(`${env.BLING_API_BASE_URL}${input.path}`);

		const response = await fetch(url, {
			method: input.method,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${input.accessToken}`,
				'enable-jwt': '1',
			},
			body: input.body ? JSON.stringify(input.body) : undefined,
		});

		if (!response.ok) {
			throw new BlingGatewayError(
				`Bling API request failed: ${input.method} || ${input.path}`,
				response.status,
				await readResponseBody(response)
			);
		}

		return response.json() as Promise<TResponse>;
	}
}
