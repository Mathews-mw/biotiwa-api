import { Session } from '@/domains/main/models/entities/session';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Session as PrismaSession } from '@/generated/prisma/client';

export class SessionMapper {
	static toDomain(data: PrismaSession): Session {
		return Session.create(
			{
				userId: new UniqueEntityId(data.userId),
				token: data.token,
				ipAddress: data.ipAddress,
				userAgent: data.userAgent,
				expiresAt: data.expiresAt,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: Session): PrismaSession {
		return {
			id: data.id.toString(),
			userId: data.userId.toString(),
			token: data.token,
			ipAddress: data.ipAddress ?? null,
			userAgent: data.userAgent ?? null,
			expiresAt: data.expiresAt,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
