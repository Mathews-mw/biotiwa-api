export class ShippingGatewayError extends Error {
	constructor(
		message: string,
		public readonly statusCode?: number,
		public readonly responseBody?: unknown
	) {
		super(message);
		this.name = 'ShippingGatewayError';
	}
}
