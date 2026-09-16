import { ShippingQuoteMapper } from './shipping-quote-mapper';
import { ShippingQuoteRateMapper } from './shipping-quote-rate-mapper';
import { ShippingQuoteRateDetails } from '@/domains/main/models/value-objects/shipping-quote-rate-details';
import type {
	ShippingQuote as PrismaShippingQuote,
	ShippingQuoteRate as PrismaShippingQuoteRate,
} from '@/generated/prisma/client';

export type IPrismaShippingQuoteRateDetails = {
	quote: PrismaShippingQuote;
	rate: PrismaShippingQuoteRate;
};

export class ShippingQuoteRateDetailsMapper {
	static toDomain(data: IPrismaShippingQuoteRateDetails): ShippingQuoteRateDetails {
		return ShippingQuoteRateDetails.create({
			quote: ShippingQuoteMapper.toDomain(data.quote),
			rate: ShippingQuoteRateMapper.toDomain(data.rate),
		});
	}
}
