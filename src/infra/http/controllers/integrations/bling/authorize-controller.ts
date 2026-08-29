import crypto from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { env } from '@/env';
import { maskState } from '@/utils/mask-state';

export async function createBlingAuthorizationUrlController(request: FastifyRequest, reply: FastifyReply) {
	const state = crypto.randomBytes(24).toString('hex');

	// Em produção, salvar esse state em tabela própria com expiração.
	reply.setCookie('bling_oauth_state', state, {
		httpOnly: true,
		sameSite: 'lax',
		secure: env.NODE_ENV === 'production',
		path: '/',
		maxAge: 60 * 10,
	});

	const authorizationUrl = new URL(env.BLING_AUTHORIZE_URL);

	authorizationUrl.searchParams.set('response_type', 'code');
	authorizationUrl.searchParams.set('client_id', env.BLING_CLIENT_ID);
	authorizationUrl.searchParams.set('state', state);

	request.log.info(
		{
			host: request.headers.host,
			forwardedHost: request.headers['x-forwarded-host'],
			forwardedProto: request.headers['x-forwarded-proto'],
			state: maskState(state),
			authorizationUrl: authorizationUrl.toString(),
		},
		'Bling OAuth authorization URL generated'
	);

	return reply.redirect(authorizationUrl.toString());
}
