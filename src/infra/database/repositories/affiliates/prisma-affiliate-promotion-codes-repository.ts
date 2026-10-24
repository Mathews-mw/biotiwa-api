import type { AffiliatePromotionCodeDetails } from '@/domains/main/models/value-objects/affiliate-promotion-code-details';
import type {
	IAffiliatePromotionCodeRepository,
	ICreateAffiliatePromotionCodeInput,
} from '@/domains/main/application/modules/affiliates/repositories/affiliate-promotion-code-repository';

import { prisma } from '../../prisma';
import { PromotionCodeMapper } from '../../mappers/promotion/promotion-code-mapper';
import { AffiliatePromotionCodeMapper } from '../../mappers/affiliates/affiliate-promotion-code-mapper';
import { AffiliatePromotionCodeDetailsMapper } from '../../mappers/affiliates/affiliate-promotion-code-details-mapper';

export class PrismaAffiliatePromotionCodesRepository implements IAffiliatePromotionCodeRepository {
	async createWithPromotionCode({
		promotionCode,
		affiliatePromotionCode,
	}: ICreateAffiliatePromotionCodeInput): Promise<AffiliatePromotionCodeDetails> {
		return prisma.$transaction(async (tx) => {
			await tx.promotionCode.create({
				data: PromotionCodeMapper.toPrisma(promotionCode),
			});

			const affiliatePromotion = await tx.affiliatePromotionCode.create({
				data: AffiliatePromotionCodeMapper.toPrisma(affiliatePromotionCode),

				include: {
					affiliate: true,
					promotionCode: true,
				},
			});

			return AffiliatePromotionCodeDetailsMapper.toDomain({
				affiliate: affiliatePromotion.affiliate,
				affiliatePromotionCode: affiliatePromotion,
				promotionCode: affiliatePromotion.promotionCode,
			});
		});
	}

	async countActiveByAffiliateId(affiliateId: string): Promise<number> {
		const now = new Date();

		return prisma.affiliatePromotionCode.count({
			where: {
				affiliateId: affiliateId,

				promotionCode: {
					status: 'ACTIVE',

					OR: [
						{
							expiresAt: null,
						},
						{
							expiresAt: {
								gt: now,
							},
						},
					],
				},
			},
		});
	}

	async findManyByAffiliateId(affiliateId: string): Promise<AffiliatePromotionCodeDetails[]> {
		const records = await prisma.affiliatePromotionCode.findMany({
			where: {
				affiliateId: affiliateId,
			},
			include: {
				affiliate: true,
				promotionCode: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return records.map((record) => {
			return AffiliatePromotionCodeDetailsMapper.toDomain({
				affiliate: record.affiliate,
				affiliatePromotionCode: record,
				promotionCode: record.promotionCode,
			});
		});
	}

	async findByPromotionCodeId(promotionCodeId: string): Promise<AffiliatePromotionCodeDetails | null> {
		const affiliatePromotionCode = await prisma.affiliatePromotionCode.findUnique({
			where: {
				promotionCodeId: promotionCodeId,
			},

			include: {
				affiliate: true,
				promotionCode: true,
			},
		});

		if (!affiliatePromotionCode) {
			return null;
		}

		return AffiliatePromotionCodeDetailsMapper.toDomain({
			affiliate: affiliatePromotionCode.affiliate,
			affiliatePromotionCode,
			promotionCode: affiliatePromotionCode.promotionCode,
		});
	}
}
