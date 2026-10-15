import type { IMarketCode } from '@/core/types/market-code';
import type { IAffiliateProgramSettingsRepository } from '@/domains/main/application/modules/affiliates/repositories/affiliate-program-settings-repository';

import { prisma } from '../../prisma';
import { AffiliateProgramSettings } from '@/domains/main/models/entities/affiliate-program-settings';
import { AffiliateProgramSettingsMapper } from '../../mappers/affiliates/affiliate-program-settings-mapper';

export class PrismaAffiliateProgramSettingsRepository implements IAffiliateProgramSettingsRepository {
	async upsert(settings: AffiliateProgramSettings): Promise<void> {
		const data = AffiliateProgramSettingsMapper.toPrisma(settings);

		await prisma.affiliateProgramSettings.upsert({
			where: {
				marketCode: settings.marketCode,
			},

			create: data,

			update: {
				isActive: settings.isActive,
				minCodeLifetimeDays: settings.minCodeLifetimeDays,
				maxCodeLifetimeDays: settings.maxCodeLifetimeDays,
				attributionWindowDays: settings.attributionWindowDays,
				updatedAt: settings.updatedAt,
			},
		});
	}

	async findByMarketCode(marketCode: IMarketCode): Promise<AffiliateProgramSettings | null> {
		const settings = await prisma.affiliateProgramSettings.findUnique({
			where: {
				marketCode,
			},
		});

		if (!settings) {
			return null;
		}

		return AffiliateProgramSettingsMapper.toDomain(settings);
	}

	async findById(programSettingsId: string): Promise<AffiliateProgramSettings | null> {
		const settings = await prisma.affiliateProgramSettings.findUnique({
			where: {
				id: programSettingsId,
			},
		});

		if (!settings) {
			return null;
		}

		return AffiliateProgramSettingsMapper.toDomain(settings);
	}
}
