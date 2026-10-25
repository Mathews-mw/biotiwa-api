import { inject, injectable } from 'tsyringe';

import type { IAffiliateStatus } from '@/domains/main/models/entities/affiliate';
import type { IAffiliateRepository } from '../repositories/affiliate-repository';
import type { IPaginationParams, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';

import { Outcome, success } from '@/core/outcome';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { AffiliateDetails } from '@/domains/main/models/value-objects/affiliate-details';

interface IRequest extends IPaginationParams {
	search?: string;
	status?: IAffiliateStatus;
}

type IResponse = Outcome<
	ResourceNotFoundError,
	{ pagination: IPaginationResponse; affiliates: Array<AffiliateDetails> }
>;

@injectable()
export class ListingAffiliatesUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATES_REPOSITORY)
		private readonly affiliateRepository: IAffiliateRepository
	) {}

	async execute({ page, perPage, search, status }: IRequest): Promise<IResponse> {
		const result = await this.affiliateRepository.listing({ page, perPage, search, status });

		return success({
			pagination: result.pagination,
			affiliates: result.affiliates,
		});
	}
}
