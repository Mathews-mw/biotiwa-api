import { inject, injectable } from 'tsyringe';

import { IMarketCode } from '@/core/types/market-code';
import { failure, Outcome, success } from '@/core/outcome';
import { Market } from '@/domains/main/models/entities/market';
import { Product } from '@/domains/main/models/entities/product';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { OrderBump } from '@/domains/main/models/entities/order-bump';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { ICommerceCatalogRepository } from '../repositories/commerce-catalog-repository';
import { OfferWithItems } from '@/domains/main/models/value-objects/offer-with-item';

interface IRequest {
	marketCode: IMarketCode;
}

type Response = Outcome<
	ResourceNotFoundError | BadRequestError,
	{
		market: Market;
		product: Product;
		offers: OfferWithItems[];
		orderBump: OrderBump | null;
	}
>;

@injectable()
export class GetPublicOffersUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.COMMERCE_CATALOG_REPOSITORY)
		private commerceCatalogRepository: ICommerceCatalogRepository
	) {}

	async execute({ marketCode }: IRequest): Promise<Response> {
		const result = await this.commerceCatalogRepository.getPublicOffersByMarket(marketCode);

		if (!result) {
			return failure(new ResourceNotFoundError('Offers not found for selected market', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		return success(result);
	}
}
