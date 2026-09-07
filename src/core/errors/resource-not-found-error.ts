import z from 'zod';
import { createHttpErrorSchemaFactory } from './http-error-factory';

export const notFoundErrors = createHttpErrorSchemaFactory({
	status: 404,
	codes: [
		'RESOURCE_NOT_FOUND_ERROR',
		'USER_NOT_FOUND',
		'PROFILE_NOT_FOUND',
		'ADDRESS_NOT_FOUND',
		'MARKET_CODE_NOT_FOUND',
		'CART_NOT_FOUND',
		'ACTIVE_CART_NOT_FOUND',
		'CART_ITEM_NOT_FOUND',
		'ORDER_NOT_FOUND',
		'PAYMENT_NOT_FOUND',
		'CHECKOUT_SESSION_NOT_FOUND',
		'BLING_CONNECTION_NOT_FOUND',
		'MELHOR_ENVIO_CONNECTION_NOT_FOUND',
	],
	defaultCode: 'RESOURCE_NOT_FOUND_ERROR',
});

type Code = z.infer<typeof notFoundErrors.codeSchema>;

export class ResourceNotFoundError extends Error {
	readonly code: Code;

	constructor(message?: string, code?: Code) {
		super(message ?? 'Resource not found');
		this.code = code ?? 'RESOURCE_NOT_FOUND_ERROR';
		this.name = 'ResourceNotFoundError';

		Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
	}
}
