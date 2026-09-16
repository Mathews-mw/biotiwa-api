import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ShippingQuote } from '@/domains/main/models/entities/shipping-quote';
import { ShippingQuoteRate } from '@/domains/main/models/entities/shipping-quote-rate';
import { ShippingQuoteDetails } from '@/domains/main/models/value-objects/shipping-quote-details';
import { ShippingQuoteRateDetails } from '@/domains/main/models/value-objects/shipping-quote-rate-details';

export interface IShippingQuoteRepository {
	createWithRates(input: { quote: ShippingQuote; rates: ShippingQuoteRate[] }): Promise<ShippingQuoteDetails>;
	findRateForCheckout(input: {
		userId: UniqueEntityId;
		cartId: UniqueEntityId;
		rateId: UniqueEntityId;
	}): Promise<ShippingQuoteRateDetails | null>;
}
