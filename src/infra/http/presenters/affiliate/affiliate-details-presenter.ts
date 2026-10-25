import type { IAffiliateDetailsResponseSchema } from '../../schemas/affiliates/affiliate-details-schema';

import { UserPresenter } from '../users/user-presenter';
import { AffiliatePresenter } from './affiliate-presenter';
import { AffiliateDetails } from '@/domains/main/models/value-objects/affiliate-details';

export class AffiliateDetailsPresenter {
	static toHTTP(data: AffiliateDetails): IAffiliateDetailsResponseSchema {
		return {
			affiliate: AffiliatePresenter.toHTTP(data.affiliate),
			user: UserPresenter.toHTTP(data.user),
		};
	}
}
