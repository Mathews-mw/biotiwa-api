import type { Affiliate as PrismaAffiliate } from '@/generated/prisma/client';
import { PromotionCode as PrismaPromotionCode } from '@/generated/prisma/client';
import type { AffiliatePromotionCode as PrismaAffiliatePromotionCode } from '@/generated/prisma/client';

import { AffiliatePromotionCodeDetails } from '@/domains/main/models/value-objects/affiliate-promotion-code-details';

import { AffiliateMapper } from './affiliate-mapper';
import { PromotionCodeMapper } from '../promotion/promotion-code-mapper';
import { AffiliatePromotionCodeMapper } from './affiliate-promotion-code-mapper';

export type PrismaAffiliatePromotionCodeDetails = {
	affiliate: PrismaAffiliate;
	promotionCode: PrismaPromotionCode;
	affiliatePromotionCode: PrismaAffiliatePromotionCode;
};

export class AffiliatePromotionCodeDetailsMapper {
	static toDomain(raw: PrismaAffiliatePromotionCodeDetails): AffiliatePromotionCodeDetails {
		return AffiliatePromotionCodeDetails.create({
			affiliate: AffiliateMapper.toDomain(raw.affiliate),
			promotionCode: PromotionCodeMapper.toDomain(raw.promotionCode),
			affiliatePromotionCode: AffiliatePromotionCodeMapper.toDomain(raw.affiliatePromotionCode),
		});
	}
}
