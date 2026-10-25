import { PromotionCode } from '@/domains/main/models/entities/promotion-code';
import { IPromotionCodeResponseSchema } from '../../schemas/promotion/promotion-code-schema';

export class PromotionCodePresenter {
	static toHTTP(data: PromotionCode): IPromotionCodeResponseSchema {
		return {
			id: data.id.toString(),
			code: data.code,
			type: data.type,
			status: data.status,
			market_code: data.marketCode,
			discount_type: data.discountType,
			discount_value: data.discountValue,
			max_uses: data.maxUses,
			max_uses_per_customer: data.maxUsesPerCustomer,
			starts_at: data.startsAt,
			expires_at: data.expiresAt,
			is_active: data.isActive,
			created_at: data.createdAt,
			updated_at: data.updatedAt ?? null,
		};
	}
}
