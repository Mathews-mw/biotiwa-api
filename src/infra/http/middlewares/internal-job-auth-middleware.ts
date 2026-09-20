import type { FastifyRequest } from 'fastify';

import { env } from '@/env';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';

export async function internalJobAuthMiddleware(request: FastifyRequest) {
	const cronSecret = request.headers['x-cron-secret'];

	if (!cronSecret || Array.isArray(cronSecret)) {
		throw new UnauthorizedError('Missing internal job secret', 'MISSING_INTERNAL_JOB_SECRET');
	}

	if (cronSecret !== env.CRON_SECRET) {
		throw new UnauthorizedError('Invalid internal job secret', 'INVALID_INTERNAL_JOB_SECRET');
	}
}
