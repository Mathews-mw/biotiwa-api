import { UserPresenter } from '../users/user-presenter';
import { MarketPresenter } from '../commerce/market-presenter';
import { CartItemDetailsPresenter } from './cart-item-details-presenter';
import { CartDetails } from '@/domains/main/models/value-objects/cart-details';
import { ICartDetailsResponseSchema } from '../../schemas/cart/cart-details-schema';

export class CartDetailsPresenter {
	static toHTTP(data: CartDetails): ICartDetailsResponseSchema {
		return {
			id: data.id.toString(),
			user_id: data.userId.toString(),
			market_code: data.marketCode,
			status: data.status,
			user: UserPresenter.toHTTP(data.user),
			market: MarketPresenter.toHTTP(data.market),
			items: data.items.map(CartItemDetailsPresenter.toHTTP),
			created_at: data.createdAt,
			updated_at: data.updatedAt,
		};
	}
}
