import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { MelhorEnvioConnection } from '@/domains/main/models/entities/integrations/melhor-envio-connection';
import { MelhorEnvioConnection as PrismaMelhorEnvioConnection } from '@/generated/prisma/client';

export class MelhorEnvioConnectionMapper {
	static toDomain(data: PrismaMelhorEnvioConnection): MelhorEnvioConnection {
		return MelhorEnvioConnection.create(
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

	static toPrisma(data: MelhorEnvioConnection): PrismaMelhorEnvioConnection {
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
