import type { Affiliate as PrismaAffiliate, User as PrismaUser } from '@/generated/prisma/client';

import { UserMapper } from '../user/user-mapper';
import { AffiliateMapper } from './affiliate-mapper';
import { AffiliateDetails } from '@/domains/main/models/value-objects/affiliate-details';

export type PrismaAffiliateDetails = {
	affiliate: PrismaAffiliate;
	user: PrismaUser;
};

export class AffiliateDetailsMapper {
	static toDomain(raw: PrismaAffiliateDetails): AffiliateDetails {
		return AffiliateDetails.create({
			affiliate: AffiliateMapper.toDomain(raw.affiliate),
			user: UserMapper.toDomain(raw.user),
		});
	}
}
