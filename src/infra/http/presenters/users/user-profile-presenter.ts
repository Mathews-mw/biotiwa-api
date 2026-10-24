import { User } from '@/domains/main/models/entities/user';
import { CustomerProfilePresenter } from './customer-presenter';
import { CustomerProfile } from '@/domains/main/models/entities/customer-profile';
import type { IUserProfileResponseSchema } from '../../schemas/user/user-profile-scheme';
import { Affiliate } from '@/domains/main/models/entities/affiliate';
import { AffiliatePresenter } from '../affiliate/affiliate-presenter';

export class UserProfilePresenter {
	static toHTTP(data: {
		user: User;
		profile?: CustomerProfile | null;
		affiliate: Affiliate | null;
	}): IUserProfileResponseSchema {
		return {
			id: data.user.id.toString(),
			name: data.user.name,
			email: data.user.email,
			email_verified: data.user.emailVerified,
			role: data.user.role,
			image: data.user.image ?? null,
			created_at: data.user.createdAt,
			updated_at: data.user.updatedAt ?? null,
			profile: data.profile ? CustomerProfilePresenter.toHTTP(data.profile) : null,
			affiliate: data.affiliate ? AffiliatePresenter.toHTTP(data.affiliate) : null,
		};
	}
}
