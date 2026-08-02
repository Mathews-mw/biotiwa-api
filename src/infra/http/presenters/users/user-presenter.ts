import { User } from '@/domains/main/models/entities/user';
import { IUserResponseSchema } from '../../schemas/user/user-schema';

export class UserPresenter {
	static toHTTP(data: User): IUserResponseSchema {
		return {
			id: data.id.toString(),
			name: data.name,
			email: data.email,
			email_verified: data.emailVerified,
			role: data.role,
			image: data.image,
			created_at: data.createdAt,
			updated_at: data.updatedAt,
		};
	}
}
