import { OrderCustomerPresenter } from './order-customer-presenter';
import { OrderPromotionPresenter } from './order-promotion-presenter';
import { OrderItemDetailsPresenter } from './order-item-details-presenter';
import { OrderShippingRatePresenter } from './order-shipping-rate-presenter';
import { OrderDetails } from '@/domains/main/models/value-objects/order-details';
import { OrderShippingAddressPresenter } from './order-shipping-address-presenter';
import type { IOrderDetailsResponseSchema } from '../../schemas/order/order-details-schema';

export class OrderDetailsPresenter {
	static toHTTP(data: OrderDetails): IOrderDetailsResponseSchema {
		return {
			id: data.id.toString(),
			user_id: data.userId.toString(),
			cart_id: data.cartId ? data.cartId.toString() : null,
			market_code: data.marketCode,
			currency: data.currency,
			status: data.status,
			items_amount: data.itemsAmount,
			order_bump_amount: data.orderBumpAmount,
			subtotal_amount: data.subtotalAmount,
			discount_amount: data.discountAmount,
			tax_amount: data.taxAmount,
			shipping_amount: data.shippingAmount,
			total_amount: data.totalAmount,
			expires_at: data.expiresAt ?? null,
			created_at: data.createdAt,
			updated_at: data.updatedAt ?? null,
			order_customer: data.orderCustomer ? OrderCustomerPresenter.toHTTP(data.orderCustomer) : null,
			order_shipping_address: data.orderShippingAddress
				? OrderShippingAddressPresenter.toHTTP(data.orderShippingAddress)
				: null,
			order_shipping_rate: data.orderShippingRate ? OrderShippingRatePresenter.toHTTP(data.orderShippingRate) : null,
			order_promotion: data.orderPromotion ? OrderPromotionPresenter.toHTTP(data.orderPromotion) : null,
			items: data.items.map(OrderItemDetailsPresenter.toHTTP),
		};
	}
}
