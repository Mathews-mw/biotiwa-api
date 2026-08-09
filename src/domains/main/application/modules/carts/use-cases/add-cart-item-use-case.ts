import { inject, injectable } from 'tsyringe';

import { Cart } from '@/domains/main/models/entities/cart';
import { failure, success, type Outcome } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { CartItem } from '@/domains/main/models/entities/cart-item';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { CartDetails } from '@/domains/main/models/value-objects/cart-details';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { calculateCartSummary, type ICartSummary } from '../calculators/calculate-cart-summary';

import type { IMarketCode } from '@/core/types/market-code';
import type { ICartRepository } from '../repositories/cart-repository';

type IRequest =
	| {
			userId: string;
			marketCode: IMarketCode;
			type: 'OFFER';
			offerId: string;
			quantity: number;
	  }
	| {
			userId: string;
			marketCode: IMarketCode;
			type: 'ORDER_BUMP';
			orderBumpId: string;
			quantity: number;
	  };

type Response = Outcome<
	BadRequestError | ResourceNotFoundError,
	{
		cart: CartDetails;
		summary: ICartSummary;
	}
>;

@injectable()
export class AddCartItemUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.CARTS_REPOSITORY)
		private cartRepository: ICartRepository
	) {}

	async execute(input: IRequest): Promise<Response> {
		if (input.quantity < 1) {
			return failure(new BadRequestError('Quantity must be greater than zero', 'CART_QUANTITY_ZERO_ERROR'));
		}

		const targetMarketCode = await this.resolveTargetMarketCode(input);

		if (!targetMarketCode) {
			return failure(new ResourceNotFoundError('Cart item target not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		if (targetMarketCode !== input.marketCode) {
			return failure(
				new BadRequestError('Cart item does not belong to selected market', 'CART_ITEM_DOES_NOT_BELONG_SELECT_MARKET')
			);
		}

		let cart: Cart | CartDetails | null = await this.cartRepository.findActiveByUserId(input.userId);

		if (!cart) {
			const newCart = Cart.create({
				userId: new UniqueEntityId(input.userId),
				marketCode: input.marketCode,
			});

			cart = await this.cartRepository.create(newCart);
		}

		if (cart.marketCode !== input.marketCode) {
			return failure(new BadRequestError('Active cart belongs to another market', 'BAD_REQUEST_ERROR'));
		}

		const updatedCart = await this.addOrIncrementItem({
			cart,
			input,
		});

		return success({
			cart: updatedCart,
			summary: calculateCartSummary(updatedCart),
		});
	}

	private async resolveTargetMarketCode(input: IRequest) {
		if (input.type === 'OFFER') {
			const offer = await this.cartRepository.findOfferDetailsById(input.offerId);

			return offer?.marketCode ?? null;
		}

		const orderBump = await this.cartRepository.findOrderBumpDetailsById(input.orderBumpId);

		return orderBump?.marketCode ?? null;
	}

	private async addOrIncrementItem({ cart, input }: { cart: CartDetails; input: IRequest }) {
		if (input.type === 'OFFER') {
			const existingItem = await this.cartRepository.findItemByOffer({
				cartId: cart.id.toString(),
				offerId: input.offerId,
			});

			if (existingItem) {
				existingItem.quantity = existingItem.quantity + input.quantity;

				return this.cartRepository.saveItem(existingItem);
			}

			const cartItem = CartItem.create({
				cartId: cart.id,
				type: 'OFFER',
				offerId: new UniqueEntityId(input.offerId),
				quantity: input.quantity,
			});

			return this.cartRepository.createItem(cartItem);
		}

		const existingItem = await this.cartRepository.findItemByOrderBump({
			cartId: cart.id.toString(),
			orderBumpId: input.orderBumpId,
		});

		if (existingItem) {
			existingItem.quantity = existingItem.quantity + input.quantity;

			return this.cartRepository.saveItem(existingItem);
		}

		const cartItem = CartItem.create({
			cartId: cart.id,
			type: 'ORDER_BUMP',
			orderBumpId: new UniqueEntityId(input.orderBumpId),
			quantity: input.quantity,
		});

		return this.cartRepository.createItem(cartItem);
	}
}
