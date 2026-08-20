import { prisma } from '../../prisma';
import { Prisma } from '@/generated/prisma/client';
import { Payment } from '@/domains/main/models/entities/payment';
import { PaymentMapper } from '../../mappers/payment/payment-mapper';

import type { IPaymentRepository } from '@/domains/main/application/modules/payments/repositories/payment-repository';

export class PrismaPaymentRepository implements IPaymentRepository {
	async create(payment: Payment) {
		const createdPayment = await prisma.payment.create({
			data: {
				id: payment.id.toString(),
				orderId: payment.orderId.toString(),
				provider: payment.provider,
				status: payment.status,
				amount: payment.amount,
				currency: payment.currency,
				providerSessionId: payment.providerSessionId,
				providerPaymentIntent: payment.providerPaymentIntent,
				providerCheckoutUrl: payment.providerCheckoutUrl,
				rawPayload: payment.rawPayload === undefined ? Prisma.JsonNull : (payment.rawPayload as Prisma.JsonObject),
				createdAt: payment.createdAt,
				updatedAt: payment.updatedAt,
			},
		});

		return PaymentMapper.toDomain(createdPayment);
	}

	async save(payment: Payment) {
		const updatedPayment = await prisma.payment.update({
			where: {
				id: payment.id.toString(),
			},
			data: {
				status: payment.status,
				providerPaymentIntent: payment.providerPaymentIntent,
				providerCheckoutUrl: payment.providerCheckoutUrl,
				rawPayload: payment.rawPayload === undefined ? Prisma.JsonNull : (payment.rawPayload as Prisma.InputJsonValue),
				updatedAt: payment.updatedAt,
			},
		});

		return PaymentMapper.toDomain(updatedPayment);
	}

	async findByProviderSessionId(providerSessionId: string) {
		const payment = await prisma.payment.findUnique({
			where: {
				providerSessionId,
			},
		});

		if (!payment) {
			return null;
		}

		return PaymentMapper.toDomain(payment);
	}

	async findPendingByOrderId(orderId: string) {
		const payment = await prisma.payment.findFirst({
			where: {
				orderId: orderId.toString(),
				status: 'PENDING',
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		if (!payment) {
			return null;
		}

		return PaymentMapper.toDomain(payment);
	}
}
