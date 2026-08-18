import { Payment } from '@/domains/main/models/entities/payment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Prisma, Payment as PrismaPayment } from '@/generated/prisma/client';

export class PaymentMapper {
	static toDomain(data: PrismaPayment): Payment {
		return Payment.create(
			{
				orderId: new UniqueEntityId(data.orderId),
				provider: data.provider,
				status: data.status,
				amount: data.amount,
				currency: data.currency,
				providerSessionId: data.providerSessionId,
				providerPaymentIntent: data.providerPaymentIntent,
				providerCheckoutUrl: data.providerCheckoutUrl,
				rawPayload: data.rawPayload,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: Payment): PrismaPayment {
		return {
			id: data.id.toString(),
			orderId: data.orderId.toString(),
			provider: data.provider,
			status: data.status,
			amount: data.amount,
			currency: data.currency,
			providerSessionId: data.providerSessionId ?? null,
			providerPaymentIntent: data.providerPaymentIntent ?? null,
			providerCheckoutUrl: data.providerCheckoutUrl ?? null,
			rawPayload: data.rawPayload ? (data.rawPayload as Prisma.JsonObject) : null,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
