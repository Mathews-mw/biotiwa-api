import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OrderShippingRate } from '@/domains/main/models/entities/order-shipping-rate';
import type { OrderShippingRate as PrismaOrderShippingRate } from '@/generated/prisma/client';

export class OrderShippingRateMapper {
	static toDomain(data: PrismaOrderShippingRate): OrderShippingRate {
		return OrderShippingRate.create(
			{
				orderId: new UniqueEntityId(data.orderId),
				shippingQuoteId: data.shippingQuoteId,
				shippingQuoteRateId: data.shippingQuoteRateId,
				provider: data.provider,
				serviceId: data.serviceId,
				serviceName: data.serviceName,
				carrierName: data.carrierName,
				amount: data.amount,
				currency: data.currency,
				estimatedDays: data.estimatedDays,
				rawPayload: data.rawPayload,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: OrderShippingRate): PrismaOrderShippingRate {
		return {
			id: data.id.toString(),
			orderId: data.orderId.toString(),
			shippingQuoteId: data.shippingQuoteId ?? null,
			shippingQuoteRateId: data.shippingQuoteRateId ?? null,
			provider: data.provider,
			serviceId: data.serviceId,
			serviceName: data.serviceName,
			carrierName: data.carrierName ?? null,
			amount: data.amount,
			currency: data.currency,
			estimatedDays: data.estimatedDays ?? null,
			rawPayload: data.rawPayload ?? null,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
