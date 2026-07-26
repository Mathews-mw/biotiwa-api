import { User } from '@/domains/main/models/entities/user';
import { User as PrismaUser } from '@/generated/prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export class UserMapper {
	static toDomain(data: PrismaUser): User {
		return User.create(
			{
				name: data.name,
				email: data.email,
				emailVerified: data.emailVerified,
				image: data.image,
				role: data.role,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: User): PrismaUser {
		return {
			id: data.id.toString(),
			name: data.name,
			email: data.email,
			emailVerified: data.emailVerified,
			image: data.image ?? null,
			role: data.role,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
