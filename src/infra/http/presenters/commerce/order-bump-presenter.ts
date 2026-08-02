import { OrderBump } from '@/domains/main/models/entities/order-bump';
import { IOrderBumpResponseSchema } from '../../schemas/commerce/order-bump-schema';

export class OderBumpPresenter {
	static toHTTP(data: OrderBump): IOrderBumpResponseSchema {
		return {
			id: data.id.toString(),
			product_id: data.productId.toString(),
			market_code: data.marketCode,
			name: data.name,
			description: data.description,
			unit_amount: data.unitAmount,
			quantity: data.quantity,
			is_active: data.isActive,
			sort_order: data.sortOrder,
			created_at: data.createdAt,
			updated_at: data.updatedAt,
		};
	}
}
