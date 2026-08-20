import { z } from 'zod';
import { createHttpErrorSchemaFactory } from './http-error-factory';

export const forbiddenErrors = createHttpErrorSchemaFactory({
	status: 403,
	codes: ['FORBIDDEN_ERROR', 'SAME_EMAIL_ERROR', 'INSUFFICIENT_PERMISSION_ERROR', 'OLD_PASSWORD_NOT_MATCH_ERROR'],
	defaultCode: 'FORBIDDEN_ERROR',
});

type Code = z.infer<typeof forbiddenErrors.codeSchema>;

export class ForbiddenError extends Error {
	readonly code: Code;

	constructor(message?: string, code?: Code) {
		super(message ?? 'Forbidden Error');
		this.code = code ?? 'FORBIDDEN_ERROR';
		this.name = 'ForbiddenError';

		// Corrige o prototype para manter a cadeia de herança correta
		Object.setPrototypeOf(this, ForbiddenError.prototype);
	}
}
