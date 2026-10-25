import { AffiliatePromotionCode } from '@/domains/main/models/entities/affiliate-promotion-code';
import type { IAffiliatePromotionCodeResponseSchema } from '../../schemas/affiliates/affiliate-promotion-code-schema';

export class AffiliatePromotionCodePresenter {
	static toHTTP(data: AffiliatePromotionCode): IAffiliatePromotionCodeResponseSchema {
		return {
			id: data.id.toString(),
			affiliate_id: data.affiliateId.toString(),
			promotion_code_id: data.promotionCodeId.toString(),
			commission_rate: data.commissionRate,
			created_at: data.createdAt,
			updated_at: data.updatedAt ?? null,
		};
	}
}
