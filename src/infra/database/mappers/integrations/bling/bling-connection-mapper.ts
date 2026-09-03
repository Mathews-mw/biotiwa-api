import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BlingConnection as PrismaBlingConnection } from '@/generated/prisma/client';
import { BlingConnection } from '@/domains/main/models/entities/integrations/bling-connection';

export class BlingConnectionMapper {
	static toDomain(data: PrismaBlingConnection): BlingConnection {
		return BlingConnection.create(
			{
				status: data.status,
				accessToken: data.accessToken,
				refreshToken: data.refreshToken,
				expiresAt: data.expiresAt,
				scope: data.scope,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: BlingConnection): PrismaBlingConnection {
		return {
			id: data.id.toString(),
			status: data.status,
			accessToken: data.accessToken,
			refreshToken: data.refreshToken,
			expiresAt: data.expiresAt,
			scope: data.scope ?? null,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
