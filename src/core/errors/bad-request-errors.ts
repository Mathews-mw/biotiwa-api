import z from 'zod';
import { createHttpErrorSchemaFactory } from './http-error-factory';

export const badRequestErrors = createHttpErrorSchemaFactory({
	status: 400,
	codes: [
		'BAD_REQUEST_ERROR',
		'SAME_EMAIL_ERROR',
		'PROFILE_ALREADY_EXISTS',
		'TERMS_NOT_ACCEPTED',
		'PRIVACY_POLICY_NOT_ACCEPTED',
		'CART_QUANTITY_ZERO_ERROR',
		'CART_ITEM_DOES_NOT_BELONG_SELECT_MARKET',
		'EMPTY_CART',
		'INVALID_CHECKOUT_AMOUNT',
		'BLING_TOKEN_REFRESH_FAILED',
		'BLING_CREATE_CONTACT_FAILED',
		'BLING_CREATE_SALES_ORDER_FAILED',
		'BLING_SYNC_ORDER_NOT_PAID',
		'BLING_ORDER_SYNC_FAILED',
		'BLING_ORDER_SYNC_NOT_CLAIMED',
		'BLING_PRODUCT_NOT_FOUND',
		'ORDER_SNAPSHOT_INCOMPLETE',
		'ORDER_CUSTOMER_SNAPSHOT_NOT_FOUND',
		'ORDER_SHIPPING_ADDRESS_SNAPSHOT_NOT_FOUND',
		'BLING_DUPLICATED_CONTACT_NOT_FOUND',
	],
	defaultCode: 'BAD_REQUEST_ERROR',
});

type Code = z.infer<typeof badRequestErrors.codeSchema>;
export type Code400Identifiers = Code;

export class BadRequestError extends Error {
	readonly code: Code;

	constructor(message?: string, code?: Code) {
		super(message ?? 'Bad Request Error');
		this.code = code ?? 'BAD_REQUEST_ERROR';
		this.name = 'BadRequestError';

		Object.setPrototypeOf(this, BadRequestError.prototype);
	}
}
