import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { MarketPresenter } from '../../presenters/commerce/market-presenter';
import { ProductPresenter } from '../../presenters/commerce/product-presenter';
import { OderBumpPresenter } from '../../presenters/commerce/order-bump-presenter';
import { IGetPublicOffersQuery } from '../../schemas/commerce/get-public-offers-schema';
import { OfferWithItemsPresenter } from '../../presenters/commerce/offer-with-items-presenter';
import { GetPublicOffersUseCase } from '@/domains/main/application/modules/commerce/use-cases/get-public-offers-use-case';

export async function getPublicOffersController(request: FastifyRequest, reply: FastifyReply) {
	const { market } = request.query as IGetPublicOffersQuery;

	const service = container.resolve(GetPublicOffersUseCase);

	const result = await service.execute({
		marketCode: market,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send({
		market: MarketPresenter.toHTTP(result.value.market),
		product: ProductPresenter.toHTTP(result.value.product),
		offers: result.value.offers.map(OfferWithItemsPresenter.toHTTP),
		order_bump: result.value.orderBump ? OderBumpPresenter.toHTTP(result.value.orderBump) : null,
	});
}
