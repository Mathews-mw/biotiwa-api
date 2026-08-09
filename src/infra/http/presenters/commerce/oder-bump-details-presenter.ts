import { ProductPresenter } from './product-presenter';
import { OrderBumpDetails } from '@/domains/main/models/value-objects/order-bump-details';
import { IOrderBumpDetailsResponseSchema } from '../../schemas/commerce/order-bump-details-schema';

export class OderBumpDetailsPresenter {
	static toHTTP(data: OrderBumpDetails): IOrderBumpDetailsResponseSchema {
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
			product: ProductPresenter.toHTTP(data.product),
			created_at: data.createdAt,
			updated_at: data.updatedAt,
		};
	}
}
