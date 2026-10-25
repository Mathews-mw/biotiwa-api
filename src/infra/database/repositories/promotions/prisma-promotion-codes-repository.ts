import type { IPromotionCodeRepository } from '@/domains/main/application/modules/promotions/repositories/promotion-code-repository';

import { prisma } from '../../prisma';
import { PromotionCode } from '@/domains/main/models/entities/promotion-code';
import { PromotionCodeMapper } from '../../mappers/promotion/promotion-code-mapper';

export class PrismaPromotionCodesRepository implements IPromotionCodeRepository {
	async findByCode(code: string) {
		const promotionCode = await prisma.promotionCode.findUnique({
			where: {
				code: PromotionCode.normalizeCode(code),
			},
		});

		if (!promotionCode) {
			return null;
		}

		return PromotionCodeMapper.toDomain(promotionCode);
	}
}
