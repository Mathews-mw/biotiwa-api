import { ValueObject } from '@/core/entities/value-object';

import { ShippingQuote } from '../entities/shipping-quote';
import { ShippingQuoteRate } from '../entities/shipping-quote-rate';

interface IShippingQuoteDetailsProps {
	quote: ShippingQuote;
	rates: ShippingQuoteRate[];
}

export class ShippingQuoteDetails extends ValueObject<IShippingQuoteDetailsProps> {
	get id() {
		return this.props.quote.id;
	}

	get quote() {
		return this.props.quote;
	}

	get rates() {
		return this.props.rates;
	}

	get expiresAt() {
		return this.props.quote.expiresAt;
	}

	static create(props: IShippingQuoteDetailsProps) {
		return new ShippingQuoteDetails(props);
	}
}
