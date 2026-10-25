import { inject, injectable } from 'tsyringe';

import type { IAffiliateRepository } from '../repositories/affiliate-repository';

import { failure, Outcome, success } from '@/core/outcome';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { Affiliate } from '@/domains/main/models/entities/affiliate';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

type AffiliateReviewDecision = 'APPROVE' | 'REJECT';

interface IRequest {
	affiliateId: string;
	decision: AffiliateReviewDecision;
}

type Response = Outcome<
	ResourceNotFoundError | BadRequestError,
	{
		affiliate: Affiliate;
	}
>;

@injectable()
export class ApprovalAffiliateRegistrationUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATES_REPOSITORY)
		private readonly affiliateRepository: IAffiliateRepository
	) {}

	async execute({ affiliateId, decision }: IRequest): Promise<Response> {
		const affiliate = await this.affiliateRepository.findById(affiliateId);

		if (!affiliate) {
			return failure(new ResourceNotFoundError('Affiliate not found', 'AFFILIATE_NOT_FOUND'));
		}

		if (!affiliate.isPending) {
			return failure(
				new BadRequestError(
					'Affiliate registration has already been reviewed',
					'AFFILIATE_REGISTRATION_ALREADY_REVIEWED'
				)
			);
		}

		if (decision === 'APPROVE') {
			affiliate.approve();
		} else {
			affiliate.reject();
		}

		await this.affiliateRepository.save(affiliate);

		return success({
			affiliate,
		});
	}
}
