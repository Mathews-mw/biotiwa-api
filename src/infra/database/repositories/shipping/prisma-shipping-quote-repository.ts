import { prisma } from '@/infra/database/prisma';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { toPrismaJson } from '../../mappers/utils/to-prisma-json-mapper';
import { ShippingQuote } from '@/domains/main/models/entities/shipping-quote';
import { ShippingQuoteRate } from '@/domains/main/models/entities/shipping-quote-rate';
import { ShippingQuoteDetails } from '@/domains/main/models/value-objects/shipping-quote-details';
import { ShippingQuoteDetailsMapper } from '../../mappers/shipping/shipping-quote-details-mapper';
import { ShippingQuoteRateDetails } from '@/domains/main/models/value-objects/shipping-quote-rate-details';
import { ShippingQuoteRateDetailsMapper } from '../../mappers/shipping/shipping-quote-rate-details-mapper';

import type { IShippingQuoteRepository } from '@/domains/main/application/modules/shipping/repositories/shipping-quote-repository';

export class PrismaShippingQuoteRepository implements IShippingQuoteRepository {
	async createWithRates(input: { quote: ShippingQuote; rates: ShippingQuoteRate[] }): Promise<ShippingQuoteDetails> {
		const createdQuote = await prisma.shippingQuote.create({
			data: {
				id: input.quote.id.toString(),
				userId: input.quote.userId.toString(),
				cartId: input.quote.cartId.toString(),
				marketCode: input.quote.marketCode,
				destinationPostalCode: input.quote.destinationPostalCode,
				cartFingerprint: input.quote.cartFingerprint,
				expiresAt: input.quote.expiresAt,
				requestPayload: toPrismaJson(input.quote.requestPayload),
				responsePayload: toPrismaJson(input.quote.responsePayload),
				createdAt: input.quote.createdAt,
				updatedAt: input.quote.updatedAt,
				rates: {
					create: input.rates.map((rate) => ({
						id: rate.id.toString(),
						provider: rate.provider,
						serviceId: rate.serviceId,
						serviceName: rate.serviceName,
						carrierName: rate.carrierName,
						amount: rate.amount,
						currency: rate.currency,
						estimatedDays: rate.estimatedDays,
						rawPayload: toPrismaJson(rate.rawPayload),
						createdAt: rate.createdAt,
					})),
				},
			},
			include: {
				rates: true,
			},
		});

		return ShippingQuoteDetailsMapper.toDomain({
			quote: createdQuote,
			rates: createdQuote.rates,
		});
	}

	async findRateForCheckout(input: {
		userId: UniqueEntityId;
		cartId: UniqueEntityId;
		rateId: UniqueEntityId;
	}): Promise<ShippingQuoteRateDetails | null> {
		const rate = await prisma.shippingQuoteRate.findFirst({
			where: {
				id: input.rateId.toString(),

				shippingQuote: {
					userId: input.userId.toString(),
					cartId: input.cartId.toString(),
				},
			},

			include: {
				shippingQuote: true,
			},
		});

		if (!rate) {
			return null;
		}

		return ShippingQuoteRateDetailsMapper.toDomain({
			quote: rate.shippingQuote,
			rate,
		});
	}
}
