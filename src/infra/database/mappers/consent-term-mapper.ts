import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ConsentTerm } from '@/domains/main/models/entities/consent-term';
import { ConsentTerm as PrismaConsentTerm } from '@/generated/prisma/client';

export class ConsentTermMapper {
	static toDomain(data: PrismaConsentTerm): ConsentTerm {
		return ConsentTerm.create(
			{
				type: data.type,
				version: data.version,
				title: data.title,
				description: data.description,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: ConsentTerm): PrismaConsentTerm {
		return {
			id: data.id.toString(),
			type: data.type,
			version: data.version,
			title: data.title,
			description: data.description ?? null,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
