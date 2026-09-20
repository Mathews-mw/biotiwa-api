import { ShippingQuote } from '@/domains/main/models/entities/shipping-quote';
import { IShippingQuoteResponseSchema } from '../../schemas/shipping/shipping-quote.schema';

export class ShippingQuotePresenter {
	static toHTTP(data: ShippingQuote): IShippingQuoteResponseSchema {
		return {
			id: data.id.toString(),
			user_id: data.userId.toString(),
			cart_id: data.cartId.toString(),
			market_code: data.marketCode,
			destination_postal_code: data.destinationPostalCode,
			cart_fingerprint: data.cartFingerprint,
			status: data.status,
			expires_at: data.expiresAt,
			created_at: data.createdAt,
			updated_at: data.updatedAt,
		};
	}
}
