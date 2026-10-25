import type { Affiliate, IAffiliateStatus } from '@/domains/main/models/entities/affiliate';
import type { IPaginationParams, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';

import { AffiliateDetails } from '@/domains/main/models/value-objects/affiliate-details';

export interface IListingAffiliatesInput extends IPaginationParams {
	search?: string;
	status?: IAffiliateStatus;
}

export interface IListingAffiliateOutput {
	pagination: IPaginationResponse;
	affiliates: AffiliateDetails[];
}

export abstract class IAffiliateRepository {
	abstract create(affiliate: Affiliate): Promise<void>;
	abstract save(affiliate: Affiliate): Promise<void>;
	abstract listing(input: IListingAffiliatesInput): Promise<IListingAffiliateOutput>;
	abstract findById(id: string): Promise<Affiliate | null>;
	abstract findByUserId(userId: string): Promise<Affiliate | null>;
}
