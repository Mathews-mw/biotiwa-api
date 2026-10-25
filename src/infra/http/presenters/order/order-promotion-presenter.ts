import { OrderPromotion } from '@/domains/main/models/entities/order-promotion';
import { IOrderPromotionResponseSchema } from '../../schemas/order/order-promotion-schema';

export class OrderPromotionPresenter {
	static toHTTP(data: OrderPromotion): IOrderPromotionResponseSchema {
		return {
			id: data.id.toString(),
			order_id: data.orderId.toString(),
			source_promotion_code_id: data.sourcePromotionCodeId?.toString(),
			code: data.code,
			type: data.type,
			discount_type: data.discountType,
			discount_value: data.discountValue,
			discount_amount: data.discountAmount,
			affiliate_id: data.affiliateId?.toString(),
			affiliate_promotion_code_id: data.affiliatePromotionCodeId?.toString(),
			affiliate_commission_rate: data.affiliateCommissionRate,
			created_at: data.createdAt,
			updated_at: data.updatedAt ?? null,
		};
	}
}
