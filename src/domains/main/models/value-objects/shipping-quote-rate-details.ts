import { ValueObject } from '@/core/entities/value-object';

import { ShippingQuote } from '../entities/shipping-quote';
import { ShippingQuoteRate } from '../entities/shipping-quote-rate';

interface IShippingQuoteRateDetailsProps {
	quote: ShippingQuote;
	rate: ShippingQuoteRate;
}

export class ShippingQuoteRateDetails extends ValueObject<IShippingQuoteRateDetailsProps> {
	get quote() {
		return this.props.quote;
	}

	get rate() {
		return this.props.rate;
	}

	static create(props: IShippingQuoteRateDetailsProps) {
		return new ShippingQuoteRateDetails(props);
	}
}
