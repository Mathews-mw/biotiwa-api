import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { UserConsent } from '@/domains/main/models/entities/user-consent';
import { UserConsent as PrismaUserConsent } from '@/generated/prisma/client';

export class UserConsentMapper {
	static toDomain(data: PrismaUserConsent): UserConsent {
		return UserConsent.create(
			{
				userId: new UniqueEntityId(data.userId),
				termId: new UniqueEntityId(data.termId),
				acceptedAt: data.acceptedAt,
				ipAddress: data.ipAddress,
				userAgent: data.userAgent,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: UserConsent): PrismaUserConsent {
		return {
			id: data.id.toString(),
			userId: data.userId.toString(),
			termId: data.termId.toString(),
			acceptedAt: data.acceptedAt,
			ipAddress: data.ipAddress ?? null,
			userAgent: data.userAgent ?? null,
		};
	}
}
