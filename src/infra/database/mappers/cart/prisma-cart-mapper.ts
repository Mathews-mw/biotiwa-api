import { User } from '@/domains/main/models/entities/user';
import { Cart } from '@/domains/main/models/entities/cart';
import { Offer } from '@/domains/main/models/entities/offer';
import { Market } from '@/domains/main/models/entities/market';
import { Product } from '@/domains/main/models/entities/product';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CartItem } from '@/domains/main/models/entities/cart-item';
import { OfferItem } from '@/domains/main/models/entities/offer-item';
import { OrderBump } from '@/domains/main/models/entities/order-bump';
import { CartDetails } from '@/domains/main/models/value-objects/cart-details';
import { OfferDetails } from '@/domains/main/models/value-objects/offer-details';
import { CartItemDetails } from '@/domains/main/models/value-objects/cart-item-details';
import { OfferItemDetails } from '@/domains/main/models/value-objects/offer-item-details';
import { OrderBumpDetails } from '@/domains/main/models/value-objects/order-bump-details';

function mapPrismaCartDetailsToDomain(cart: PrismaCartWithRelations): CartDetails {
	return CartDetails.create({
		cart: Cart.create(
			{
				userId: new UniqueEntityId(cart.userId),
				marketCode: cart.marketCode,
				status: cart.status,
				createdAt: cart.createdAt,
				updatedAt: cart.updatedAt,
			},
			new UniqueEntityId(cart.id)
		),

		user: User.create(
			{
				name: cart.user.name,
				email: cart.user.email,
				emailVerified: cart.user.emailVerified,
				image: cart.user.image,
				role: cart.user.role,
				createdAt: cart.user.createdAt,
				updatedAt: cart.user.updatedAt,
			},
			new UniqueEntityId(cart.user.id)
		),

		market: Market.create(
			{
				code: cart.market.code,
				label: cart.market.label,
				locale: cart.market.locale,
				currency: cart.market.currency,
				shippingAmount: cart.market.shippingAmount,
				taxRate: Number(cart.market.taxRate),
				isActive: cart.market.isActive,
				createdAt: cart.market.createdAt,
				updatedAt: cart.market.updatedAt,
			},
			new UniqueEntityId(cart.market.id)
		),

		items: cart.items.map(mapPrismaCartItemDetailsToDomain),
	});
}

function mapPrismaCartItemDetailsToDomain(item: PrismaCartItemWithRelations): CartItemDetails {
	return CartItemDetails.create({
		cartItem: mapPrismaCartItemEntityToDomain(item),

		product: item.product ? mapPrismaProductToDomain(item.product) : null,

		offer: item.offer ? mapPrismaOfferDetailsToDomain(item.offer) : null,

		orderBump: item.orderBump ? mapPrismaOrderBumpDetailsToDomain(item.orderBump) : null,
	});
}

function mapPrismaCartItemEntityToDomain(item: {
	id: string;
	cartId: string;
	productId: string | null;
	offerId: string | null;
	orderBumpId: string | null;
	type: 'OFFER' | 'PRODUCT' | 'ORDER_BUMP';
	quantity: number;
	createdAt: Date;
	updatedAt: Date | null;
}) {
	return CartItem.create(
		{
			cartId: new UniqueEntityId(item.cartId),
			productId: item.productId ? new UniqueEntityId(item.productId) : null,
			offerId: item.offerId ? new UniqueEntityId(item.offerId) : null,
			orderBumpId: item.orderBumpId ? new UniqueEntityId(item.orderBumpId) : null,
			type: item.type,
			quantity: item.quantity,
			createdAt: item.createdAt,
			updatedAt: item.updatedAt,
		},
		new UniqueEntityId(item.id)
	);
}

function mapPrismaOfferDetailsToDomain(offer: PrismaOfferWithItems): OfferDetails {
	return OfferDetails.create({
		offer: Offer.create(
			{
				slug: offer.slug,
				marketCode: offer.marketCode,
				name: offer.name,
				description: offer.description,
				unitAmount: offer.unitAmount,
				discountPercent: offer.discountPercent,
				isHighlighted: offer.isHighlighted,
				status: offer.status,
				sortOrder: offer.sortOrder,
				createdAt: offer.createdAt,
				updatedAt: offer.updatedAt,
			},
			new UniqueEntityId(offer.id)
		),

		items: offer.items.map((item) => {
			return OfferItemDetails.create({
				offerItem: OfferItem.create(
					{
						offerId: new UniqueEntityId(item.offerId),
						productId: new UniqueEntityId(item.productId),
						quantity: item.quantity,
						createdAt: item.createdAt,
					},
					new UniqueEntityId(item.id)
				),
				product: mapPrismaProductToDomain(item.product),
			});
		}),
	});
}

function mapPrismaOrderBumpDetailsToDomain(orderBump: PrismaOrderBumpWithProduct): OrderBumpDetails {
	return OrderBumpDetails.create({
		orderBump: OrderBump.create(
			{
				productId: new UniqueEntityId(orderBump.productId),
				marketCode: orderBump.marketCode,
				name: orderBump.name,
				description: orderBump.description,
				unitAmount: orderBump.unitAmount,
				quantity: orderBump.quantity,
				isActive: orderBump.isActive,
				sortOrder: orderBump.sortOrder,
				createdAt: orderBump.createdAt,
				updatedAt: orderBump.updatedAt,
			},
			new UniqueEntityId(orderBump.id)
		),

		product: mapPrismaProductToDomain(orderBump.product),
	});
}

function mapPrismaProductToDomain(product: {
	id: string;
	sku: string;
	slug: string;
	name: string;
	shortDescription: string;
	description: string | null;
	imageUrl: string | null;
	pillsPerPack: number | null;
	status: 'DRAFT' | 'ARCHIVED' | 'ACTIVE';
	createdAt: Date;
	updatedAt: Date | null;
}) {
	return Product.create(
		{
			sku: product.sku,
			slug: product.slug,
			name: product.name,
			shortDescription: product.shortDescription,
			description: product.description,
			imageUrl: product.imageUrl,
			pillsPerPack: product.pillsPerPack,
			status: product.status,
			createdAt: product.createdAt,
			updatedAt: product.updatedAt,
		},
		new UniqueEntityId(product.id)
	);
}
