import { Account } from '@/domains/main/models/entities/account';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Account as PrismaAccount } from '@/generated/prisma/client';

export class AccountMapper {
	static toDomain(data: PrismaAccount): Account {
		return Account.create(
			{
				userId: new UniqueEntityId(data.userId),
				accountId: data.accountId,
				providerId: data.providerId,
				provider: data.provider,
				accessToken: data.accessToken,
				refreshToken: data.refreshToken,
				accessTokenExpiresAt: data.accessTokenExpiresAt,
				refreshTokenExpiresAt: data.refreshTokenExpiresAt,
				scope: data.scope,
				idToken: data.idToken,
				password: data.password,
				isActive: data.isActive,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: Account): PrismaAccount {
		return {
			id: data.id.toString(),
			userId: data.userId.toString(),
			accountId: data.accountId,
			providerId: data.providerId,
			provider: data.provider,
			accessToken: data.accessToken ?? null,
			refreshToken: data.refreshToken ?? null,
			accessTokenExpiresAt: data.accessTokenExpiresAt ?? null,
			refreshTokenExpiresAt: data.refreshTokenExpiresAt ?? null,
			scope: data.scope ?? null,
			idToken: data.idToken ?? null,
			password: data.password ?? null,
			isActive: data.isActive,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
