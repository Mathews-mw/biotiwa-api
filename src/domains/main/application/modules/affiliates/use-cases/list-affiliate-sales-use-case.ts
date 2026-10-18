import { inject, injectable } from 'tsyringe';

import type { ICurrencyCode } from '@/core/types/currency-code';
import type { IAffiliateRepository } from '../repositories/affiliate-repository';
import type { IPaginationParams, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';
import type { IAffiliateCommissionStatus } from '@/domains/main/models/entities/affiliate-commission';
import type { IAffiliateSale, IAffiliateSalesRepository } from '../repositories/affiliate-sales-repository';

import { failure, Outcome, success } from '@/core/outcome';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest extends IPaginationParams {
	userId: string;
	commissionStatus?: IAffiliateCommissionStatus;
	currency?: ICurrencyCode;
}

type IResponse = Outcome<ResourceNotFoundError, { pagination: IPaginationResponse; sales: Array<IAffiliateSale> }>;

@injectable()
export class ListAffiliateSalesUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATES_REPOSITORY)
		private readonly affiliateRepository: IAffiliateRepository,
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_SALES_REPOSITORY)
		private readonly affiliateSalesRepository: IAffiliateSalesRepository
	) {}

	async execute({ userId, page, perPage, currency, commissionStatus }: IRequest): Promise<IResponse> {
		const affiliate = await this.affiliateRepository.findByUserId(userId);

		if (!affiliate) {
			return failure(new ResourceNotFoundError('Affiliate not found', 'AFFILIATE_NOT_FOUND'));
		}

		const { items, pagination } = await this.affiliateSalesRepository.list({
			affiliateId: affiliate.id.toString(),
			page,
			perPage,
			currency,
			commissionStatus,
		});

		return success({
			pagination,
			sales: items,
		});
	}
}
