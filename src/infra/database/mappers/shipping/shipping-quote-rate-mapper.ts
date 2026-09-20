import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ShippingQuoteRate } from '@/domains/main/models/entities/shipping-quote-rate';
import type { ShippingQuoteRate as PrismaShippingQuoteRate } from '@/generated/prisma/client';

export class ShippingQuoteRateMapper {
	static toDomain(data: PrismaShippingQuoteRate): ShippingQuoteRate {
		return ShippingQuoteRate.create(
			{
				shippingQuoteId: new UniqueEntityId(data.shippingQuoteId),
				provider: data.provider,
				serviceId: data.serviceId,
				serviceName: data.serviceName,
				carrierName: data.carrierName,
				amount: data.amount,
				currency: data.currency,
				estimatedDays: data.estimatedDays,
				rawPayload: data.rawPayload,
				createdAt: data.createdAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: ShippingQuoteRate): PrismaShippingQuoteRate {
		return {
			id: data.id.toString(),
			shippingQuoteId: data.shippingQuoteId.toString(),
			provider: data.provider,
			serviceId: data.serviceId,
			serviceName: data.serviceName,
			carrierName: data.carrierName ?? null,
			amount: data.amount,
			currency: data.currency,
			estimatedDays: data.estimatedDays ?? null,
			rawPayload: data.rawPayload ?? null,
			createdAt: data.createdAt,
		};
	}
}
