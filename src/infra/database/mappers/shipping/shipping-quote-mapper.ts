import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ShippingQuote } from '@/domains/main/models/entities/shipping-quote';
import type { ShippingQuote as PrismaShippingQuote } from '@/generated/prisma/client';

export class ShippingQuoteMapper {
	static toDomain(data: PrismaShippingQuote): ShippingQuote {
		return ShippingQuote.create(
			{
				userId: new UniqueEntityId(data.userId),
				cartId: new UniqueEntityId(data.cartId),
				marketCode: data.marketCode,
				destinationPostalCode: data.destinationPostalCode,
				cartFingerprint: data.cartFingerprint,
				status: data.status,
				expiresAt: data.expiresAt,
				requestPayload: data.requestPayload,
				responsePayload: data.responsePayload,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: ShippingQuote): PrismaShippingQuote {
		return {
			id: data.id.toString(),
			userId: data.userId.toString(),
			cartId: data.cartId.toString(),
			marketCode: data.marketCode,
			destinationPostalCode: data.destinationPostalCode,
			cartFingerprint: data.cartFingerprint,
			status: data.status,
			expiresAt: data.expiresAt,
			requestPayload: data.requestPayload ?? null,
			responsePayload: data.responsePayload ?? null,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
