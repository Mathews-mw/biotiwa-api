export class BlingGatewayError extends Error {
	constructor(
		message?: string,
		public readonly statusCode?: number,
		public readonly responseBody?: unknown
	) {
		super(message);
		this.name = 'BlingGatewayError';

		Object.setPrototypeOf(this, BlingGatewayError.prototype);
	}
}
