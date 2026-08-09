import { prisma } from '../../prisma';
import { Prisma } from '@/generated/prisma/client';
import { Cart } from '@/domains/main/models/entities/cart';
import { CartItem } from '@/domains/main/models/entities/cart-item';
import { CartItemMapper } from '../../mappers/cart/cart-item-mapper';
import { CartDetailsMapper } from '../../mappers/cart/cart-details-mapper';
import { CartDetails } from '@/domains/main/models/value-objects/cart-details';
import { OfferDetails } from '@/domains/main/models/value-objects/offer-details';
import { OfferDetailsMapper } from '../../mappers/commerce/offer-details-mapper';
import { OrderBumpDetails } from '@/domains/main/models/value-objects/order-bump-details';
import { OrderBumpDetailsMapper } from '../../mappers/commerce/order-bump-details-mapper';

import type { ICartRepository } from '@/domains/main/application/modules/carts/repositories/cart-repository';

const includesCartDetails: Prisma.CartInclude = {
	user: true,
	market: true,
	items: {
		include: {
			offer: {
				include: {
					items: {
						include: {
							product: true,
						},
					},
				},
			},
			orderBump: {
				include: {
					product: true,
				},
			},
			product: true,
		},
	},
};

export class PrismaCartsRepository implements ICartRepository {
	async create(cart: Cart): Promise<CartDetails> {
		const result = await prisma.cart.create({
			data: {
				id: cart.id.toString(),
				userId: cart.userId.toString(),
				marketCode: cart.marketCode,
				status: cart.status,
				createdAt: cart.createdAt,
				updatedAt: cart.updatedAt,
			},
			include: includesCartDetails,
		});

		return CartDetailsMapper.toDomain(result);
	}

	async createItem(cartItem: CartItem): Promise<CartDetails> {
		const result = await prisma.cartItem.create({
			data: {
				id: cartItem.id.toString(),
				cartId: cartItem.cartId.toString(),
				type: cartItem.type,
				productId: cartItem.productId?.toString() ?? null,
				offerId: cartItem.offerId?.toString() ?? null,
				orderBumpId: cartItem.orderBumpId?.toString() ?? null,
				quantity: cartItem.quantity,
				createdAt: cartItem.createdAt,
				updatedAt: cartItem.updatedAt,
			},
			select: {
				cart: {
					include: includesCartDetails,
				},
			},
		});

		return CartDetailsMapper.toDomain(result.cart);
	}

	async saveItem(cartItem: CartItem): Promise<CartDetails> {
		const result = await prisma.cartItem.update({
			where: {
				id: cartItem.id.toString(),
			},
			data: {
				productId: cartItem.productId?.toString() ?? null,
				offerId: cartItem.offerId?.toString() ?? null,
				orderBumpId: cartItem.orderBumpId?.toString() ?? null,
				type: cartItem.type,
				quantity: cartItem.quantity,
				updatedAt: cartItem.updatedAt,
			},
			select: {
				cart: {
					include: includesCartDetails,
				},
			},
		});

		return CartDetailsMapper.toDomain(result.cart);
	}

	async removeItem(cartItem: CartItem): Promise<CartDetails> {
		const result = await prisma.cartItem.delete({
			where: {
				id: cartItem.id.toString(),
			},
			select: {
				cart: {
					include: includesCartDetails,
				},
			},
		});

		return CartDetailsMapper.toDomain(result.cart);
	}

	async clearActiveCart(userId: string): Promise<void> {
		const cart = await prisma.cart.findFirst({
			where: {
				userId: userId.toString(),
				status: 'ACTIVE',
			},
		});

		if (!cart) {
			return;
		}

		await prisma.cartItem.deleteMany({
			where: {
				cartId: cart.id,
			},
		});
	}

	async findActiveByUserId(userId: string): Promise<CartDetails | null> {
		const cart = await prisma.cart.findFirst({
			where: {
				userId: userId.toString(),
				status: 'ACTIVE',
			},
			include: includesCartDetails,
			orderBy: {
				updatedAt: 'desc',
			},
		});

		if (!cart) {
			return null;
		}

		return CartDetailsMapper.toDomain(cart);
	}

	async findActiveByUserIdAndMarket(input: { userId: string; marketCode: 'BR' | 'US' }): Promise<CartDetails | null> {
		const cart = await prisma.cart.findFirst({
			where: {
				userId: input.userId.toString(),
				marketCode: input.marketCode,
				status: 'ACTIVE',
			},
			include: includesCartDetails,
			orderBy: {
				updatedAt: 'desc',
			},
		});

		if (!cart) {
			return null;
		}

		return CartDetailsMapper.toDomain(cart);
	}

	async findOfferDetailsById(offerId: string): Promise<OfferDetails | null> {
		const offer = await prisma.offer.findFirst({
			where: {
				id: offerId.toString(),
				status: 'ACTIVE',
			},
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});

		if (!offer) {
			return null;
		}

		return OfferDetailsMapper.toDomain(offer);
	}

	async findOrderBumpDetailsById(orderBumpId: string): Promise<OrderBumpDetails | null> {
		const orderBump = await prisma.orderBump.findFirst({
			where: {
				id: orderBumpId.toString(),
				isActive: true,
			},
			include: {
				product: true,
			},
		});

		if (!orderBump) {
			return null;
		}

		return OrderBumpDetailsMapper.toDomain(orderBump);
	}

	async findItemByOffer(input: { cartId: string; offerId: string }): Promise<CartItem | null> {
		const item = await prisma.cartItem.findFirst({
			where: {
				cartId: input.cartId.toString(),
				offerId: input.offerId.toString(),
			},
		});

		if (!item) {
			return null;
		}

		return CartItemMapper.toDomain(item);
	}

	async findItemByOrderBump(input: { cartId: string; orderBumpId: string }): Promise<CartItem | null> {
		const item = await prisma.cartItem.findFirst({
			where: {
				cartId: input.cartId.toString(),
				orderBumpId: input.orderBumpId.toString(),
			},
		});

		if (!item) {
			return null;
		}

		return CartItemMapper.toDomain(item);
	}

	async findItemByIdAndUserId(input: { cartItemId: string; userId: string }): Promise<CartItem | null> {
		const item = await prisma.cartItem.findFirst({
			where: {
				id: input.cartItemId.toString(),
				cart: {
					userId: input.userId.toString(),
					status: 'ACTIVE',
				},
			},
		});

		if (!item) {
			return null;
		}

		return CartItemMapper.toDomain(item);
	}
}
