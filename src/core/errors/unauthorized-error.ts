import z from 'zod';

export const code401Schema = z
	.union([
		z.literal('UNAUTHORIZED_ERROR'),
		z.literal('AUTH_EXPIRED_TOKEN_ERROR'),
		z.literal('AUTH_INVALID_TOKEN_ERROR'),
		z.literal('INVALID_SESSION_EXPIRED'),
		z.literal('AUTH_NO_AUTHORIZATION_IN_COOKIE_ERROR'),
		z.literal('CREDENTIALS_TYPE_ERROR'),
		z.literal('AUTH_MIDDLEWARE_NOT_EXECUTED'),
		z.literal('AUTH_INVALID_CREDENTIALS_ERROR'),
	])
	.default('UNAUTHORIZED_ERROR');

type Code = z.infer<typeof code401Schema>;

export class UnauthorizedError extends Error {
	readonly code: Code;

	constructor(message?: string, code?: Code) {
		super(message ?? 'Unauthorized');
		this.code = code ?? 'UNAUTHORIZED_ERROR';

		this.name = 'UnauthorizedError';

		Object.setPrototypeOf(this, UnauthorizedError.prototype);
	}
}
