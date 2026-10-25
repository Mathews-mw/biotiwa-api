import { PromotionRedemption } from '@/domains/main/models/entities/promotion-redemption';
import { IPromotionRedemptionResponseSchema } from '../../schemas/promotion/promotion-redemption-schema';

export class PromotionRedemptionPresenter {
	static toHTTP(data: PromotionRedemption): IPromotionRedemptionResponseSchema {
		return {
			id: data.id.toString(),
			promotion_code_id: data.promotionCodeId.toString(),
			user_id: data.userId.toString(),
			order_id: data.orderId.toString(),
			status: data.status,
			discount_amount: data.discountAmount,
			reserved_until: data.reservedUntil,
			redeemed_at: data.redeemedAt,
			canceled_at: data.canceledAt,
			expired_at: data.expiresAt,
			created_at: data.createdAt,
			updated_at: data.updatedAt,
		};
	}
}
