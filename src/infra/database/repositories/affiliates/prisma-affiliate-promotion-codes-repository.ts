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

	async findByPromotionCodeId(promotionCodeId: string): Promise<AffiliatePromotionCodeDetails | null> {
		const affiliatePromotionCode = await prisma.affiliatePromotionCode.findUnique({
			where: {
				promotionCodeId: promotionCodeId.toString(),
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
