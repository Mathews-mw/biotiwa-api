import { UserMapper } from '../user/user-mapper';
import { MarketMapper } from '../commerce/market-mapper';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CartDetails } from '@/domains/main/models/value-objects/cart-details';
import { CartItemDetailsMapper, IPrismaCartItemDetails } from './cart-item-details-mapper';
import { Cart as PrismaCart, Market as PrismaMarket, User as PrismaUser } from '@/generated/prisma/client';

export type IPrismaCartDetails = PrismaCart & {
	user: PrismaUser;
	market: PrismaMarket;
	items: IPrismaCartItemDetails[];
};

export class CartDetailsMapper {
	static toDomain(data: IPrismaCartDetails): CartDetails {
		return CartDetails.create({
			id: new UniqueEntityId(data.id),
			userId: new UniqueEntityId(data.userId),
			marketCode: data.marketCode,
			status: data.status,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			user: UserMapper.toDomain(data.user),
			market: MarketMapper.toDomain(data.market),
			items: data.items.map(CartItemDetailsMapper.toDomain),
		});
	}
}
