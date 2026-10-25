import { inject, injectable } from 'tsyringe';

import type { Affiliate } from '@/domains/main/models/entities/affiliate';
import type { IAffiliateRepository } from '../repositories/affiliate-repository';
import type {
	IAffiliateDashboardRepository,
	IAffiliateDashboardData,
} from '../repositories/affiliate-dashboard-repository';

import { failure, success, type Outcome } from '@/core/outcome';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	userId: string;
}

type Response = Outcome<
	ResourceNotFoundError,
	{
		affiliate: Affiliate;
		dashboard: IAffiliateDashboardData;
	}
>;

@injectable()
export class GetAffiliateDashboardUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATES_REPOSITORY)
		private readonly affiliateRepository: IAffiliateRepository,
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_DASHBOARD_REPOSITORY)
		private readonly affiliateDashboardRepository: IAffiliateDashboardRepository
	) {}

	async execute({ userId }: IRequest): Promise<Response> {
		const affiliate = await this.affiliateRepository.findByUserId(userId);

		if (!affiliate) {
			return failure(new ResourceNotFoundError('Affiliate not found', 'AFFILIATE_NOT_FOUND'));
		}

		const dashboard = await this.affiliateDashboardRepository.getDashboard(affiliate.id.toString());

		return success({
			affiliate,
			dashboard,
		});
	}
}
