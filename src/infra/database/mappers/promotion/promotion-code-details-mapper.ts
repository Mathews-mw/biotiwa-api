import type {
	PromotionCode as PrismaPromotionCode,
	PromotionRedemption as PrismaPromotionRedemption,
} from '@/generated/prisma/client';

import { PromotionCodeMapper } from './promotion-code-mapper';
import { PromotionRedemptionMapper } from './promotion-redemption-mapper';
import { PromotionCodeDetails } from '@/domains/main/models/value-objects/promotion-code-details';

export type PrismaPromotionCodeDetails = {
	promotionCode: PrismaPromotionCode;
	redemptions: PrismaPromotionRedemption[];
};

export class PromotionCodeDetailsMapper {
	static toDomain(data: PrismaPromotionCodeDetails): PromotionCodeDetails {
		return PromotionCodeDetails.create({
			promotionCode: PromotionCodeMapper.toDomain(data.promotionCode),
			redemptions: data.redemptions.map(PromotionRedemptionMapper.toDomain),
		});
	}
}
