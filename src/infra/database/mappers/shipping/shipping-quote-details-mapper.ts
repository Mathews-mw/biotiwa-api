import { ShippingQuoteMapper } from './shipping-quote-mapper';
import { ShippingQuoteRateMapper } from './shipping-quote-rate-mapper';
import { ShippingQuoteDetails } from '@/domains/main/models/value-objects/shipping-quote-details';

import type {
	ShippingQuote as PrismaShippingQuote,
	ShippingQuoteRate as PrismaShippingQuoteRate,
} from '@/generated/prisma/client';

export type IPrismaShippingQuoteDetails = {
	quote: PrismaShippingQuote;
	rates: PrismaShippingQuoteRate[];
};

export class ShippingQuoteDetailsMapper {
	static toDomain(data: IPrismaShippingQuoteDetails): ShippingQuoteDetails {
		return ShippingQuoteDetails.create({
			quote: ShippingQuoteMapper.toDomain(data.quote),
			rates: data.rates.map(ShippingQuoteRateMapper.toDomain),
		});
	}
}
