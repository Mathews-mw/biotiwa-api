import { injectable } from 'tsyringe';

import type { IAffiliateCommissionRepository } from '@/domains/main/application/modules/affiliates/repositories/affiliate-commission-repository';

import { prisma } from '../../prisma';
import { AffiliateCommission } from '@/domains/main/models/entities/affiliate-commission';
import { PrismaAffiliateCommissionMapper } from '../../mappers/affiliates/affiliate-commission-mapper';

@injectable()
export class PrismaAffiliateCommissionRepository implements IAffiliateCommissionRepository {
	async create(commission: AffiliateCommission): Promise<void> {
		const data = PrismaAffiliateCommissionMapper.toPrisma(commission);

		await prisma.affiliateCommission.create({
			data,
		});
	}

	async save(commission: AffiliateCommission): Promise<void> {
		await prisma.affiliateCommission.update({
			where: {
				id: commission.id.toString(),
			},

			data: {
				status: commission.status,
				availableAt: commission.availableAt,
				paidAt: commission.paidAt,
				canceledAt: commission.canceledAt,
				updatedAt: commission.updatedAt,
			},
		});
	}

	async findByOrderId(orderId: string): Promise<AffiliateCommission | null> {
		const commission = await prisma.affiliateCommission.findUnique({
			where: {
				orderId: orderId.toString(),
			},
		});

		if (!commission) {
			return null;
		}

		return PrismaAffiliateCommissionMapper.toDomain(commission);
	}
}
