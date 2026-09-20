export class NoShippingProfileError extends Error {
	constructor(
		message?: string,
		public readonly statusCode?: number,
		public readonly responseBody?: unknown
	) {
		super(message);
		this.name = 'NoShippingProfileError';

		Object.setPrototypeOf(this, NoShippingProfileError.prototype);
	}
}
