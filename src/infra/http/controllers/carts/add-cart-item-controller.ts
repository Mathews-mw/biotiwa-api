import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { CartDetailsPresenter } from '../../presenters/cart/cart-details-presenter';
import { CartSummaryPresenter } from '../../presenters/cart/cart-summary-presenter';
import { getAuthenticatedSession } from '@/infra/http/helpers/get-authenticated-session';
import { AddCartItemUseCase } from '@/domains/main/application/modules/carts/use-cases/add-cart-item-use-case';

import type { IAddCartItemRequest } from '../../schemas/cart/add-cart-item-schema';

export async function addCartItemController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);
	const body = request.body as IAddCartItemRequest;

	const service = container.resolve(AddCartItemUseCase);

	const result =
		body.type === 'OFFER'
			? await service.execute({
					userId: session.userId,
					type: 'OFFER',
					marketCode: body.market_code,
					offerId: body.offer_id,
					quantity: body.quantity ?? 1,
				})
			: await service.execute({
					userId: session.userId,
					type: 'ORDER_BUMP',
					marketCode: body.market_code,
					orderBumpId: body.order_bump_id,
					quantity: body.quantity ?? 1,
				});

	if (result.isFalse()) {
		throw result.value;
	}

	const { cart, summary } = result.value;

	const response = {
		message: 'Item added successfully',
		cart: CartDetailsPresenter.toHTTP(cart),
		summary: CartSummaryPresenter.toHTTP(summary),
	};

	return reply.status(200).send(response);
}
