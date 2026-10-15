import type { IAffiliateRepository } from '@/domains/main/application/modules/affiliates/repositories/affiliate-repository';

import { prisma } from '../../prisma';
import { Affiliate } from '@/domains/main/models/entities/affiliate';
import { AffiliateMapper } from '../../mappers/affiliates/affiliate-mapper';

export class PrismaAffiliateRepository implements IAffiliateRepository {
	async create(affiliate: Affiliate) {
		const data = AffiliateMapper.toPrisma(affiliate);

		await prisma.affiliate.create({
			data,
		});
	}

	async save(affiliate: Affiliate) {
		await prisma.affiliate.update({
			where: {
				id: affiliate.id.toString(),
			},

			data: {
				type: affiliate.type,
				status: affiliate.status,
				updatedAt: affiliate.updatedAt,
			},
		});
	}

	async findById(id: string): Promise<Affiliate | null> {
		const affiliate = await prisma.affiliate.findUnique({
			where: {
				id: id.toString(),
			},
		});

		if (!affiliate) {
			return null;
		}

		return AffiliateMapper.toDomain(affiliate);
	}

	async findByUserId(userId: string): Promise<Affiliate | null> {
		const affiliate = await prisma.affiliate.findUnique({
			where: {
				userId: userId.toString(),
			},
		});

		if (!affiliate) {
			return null;
		}

		return AffiliateMapper.toDomain(affiliate);
	}
}
