import type { AffiliateProgramSettings as PrismaAffiliateProgramSettings } from '@/generated/prisma/client';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AffiliateProgramSettings } from '@/domains/main/models/entities/affiliate-program-settings';

export class AffiliateProgramSettingsMapper {
	static toDomain(raw: PrismaAffiliateProgramSettings): AffiliateProgramSettings {
		return AffiliateProgramSettings.create(
			{
				marketCode: raw.marketCode,
				isActive: raw.isActive,
				minCodeLifetimeDays: raw.minCodeLifetimeDays,
				maxCodeLifetimeDays: raw.maxCodeLifetimeDays,
				attributionWindowDays: raw.attributionWindowDays,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityId(raw.id)
		);
	}

	static toPrisma(settings: AffiliateProgramSettings): PrismaAffiliateProgramSettings {
		return {
			id: settings.id.toString(),
			marketCode: settings.marketCode,
			isActive: settings.isActive,
			minCodeLifetimeDays: settings.minCodeLifetimeDays,
			maxCodeLifetimeDays: settings.maxCodeLifetimeDays,
			attributionWindowDays: settings.attributionWindowDays,
			createdAt: settings.createdAt,
			updatedAt: settings.updatedAt ?? null,
		};
	}
}
