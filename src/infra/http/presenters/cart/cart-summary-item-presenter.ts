import type { ICartSummaryItemResponseSchema } from '../../schemas/cart/cart-summary-item-schema';
import type { ICartSummaryItem } from '@/domains/main/application/modules/carts/calculators/calculate-cart-summary';

export class CartSummaryItemPresenter {
	static toHTTP(data: ICartSummaryItem): ICartSummaryItemResponseSchema {
		return {
			cart_item_id: data.cartItemId,
			type: data.type,
			name: data.name,
			quantity: data.quantity,
			unit_amount: data.unitAmount,
			total_amount: data.totalAmount,
		};
	}
}
