import { Cart } from '@/domains/main/models/entities/cart';
import { ICartResponseSchema } from '../../schemas/cart/cart-schema';

export class CartPresenter {
	static toHTTP(data: Cart): ICartResponseSchema {
		return {
			id: data.id.toString(),
			user_id: data.userId.toString(),
			market_code: data.marketCode,
			status: data.status,
			created_at: data.createdAt,
			updated_at: data.updatedAt ?? null,
		};
	}
}
