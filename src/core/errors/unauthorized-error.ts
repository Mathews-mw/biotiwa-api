import z from 'zod';
import { createHttpErrorSchemaFactory } from './http-error-factory';

export const unauthorizedErrors = createHttpErrorSchemaFactory({
	status: 401,
	codes: [
		'UNAUTHORIZED_ERROR',
		'AUTH_EXPIRED_TOKEN_ERROR',
		'AUTH_INVALID_TOKEN_ERROR',
		'INVALID_SESSION_EXPIRED',
		'AUTH_NO_AUTHORIZATION_IN_COOKIE_ERROR',
		'CREDENTIALS_TYPE_ERROR',
		'AUTH_MIDDLEWARE_NOT_EXECUTED',
		'AUTH_INVALID_CREDENTIALS_ERROR',
		'MISSING_INTERNAL_JOB_SECRET',
		'INVALID_INTERNAL_JOB_SECRET',
	],
	defaultCode: 'UNAUTHORIZED_ERROR',
});

type Code = z.infer<typeof unauthorizedErrors.codeSchema>;
export type Code401Identifiers = Code;

export class UnauthorizedError extends Error {
	readonly code: Code;

	constructor(message?: string, code?: Code) {
		super(message ?? 'Unauthorized');
		this.code = code ?? 'UNAUTHORIZED_ERROR';

		this.name = 'UnauthorizedError';

		Object.setPrototypeOf(this, UnauthorizedError.prototype);
	}
}
