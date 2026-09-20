import { ShippingQuotePresenter } from './shipping-quote-presenter';
import { ShippingQuoteRatePresenter } from './shipping-quote-rate-presenter';
import { ShippingQuoteDetails } from '@/domains/main/models/value-objects/shipping-quote-details';
import type { IShippingQuoteDetailsResponseSchema } from '../../schemas/shipping/shipping-quote-details-schema';

export class ShippingQuoteDetailsPresenter {
	static toHTTP(data: ShippingQuoteDetails): IShippingQuoteDetailsResponseSchema {
		return {
			quote: ShippingQuotePresenter.toHTTP(data.quote),
			rates: data.rates.map(ShippingQuoteRatePresenter.toHTTP),
		};
	}
}
