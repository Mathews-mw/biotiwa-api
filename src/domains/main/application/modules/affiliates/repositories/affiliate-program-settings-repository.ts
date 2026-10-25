import type { IMarketCode } from '@/core/types/market-code';
import { AffiliateProgramSettings } from '@/domains/main/models/entities/affiliate-program-settings';

export abstract class IAffiliateProgramSettingsRepository {
	abstract upsert(settings: AffiliateProgramSettings): Promise<void>;
	abstract findById(programSettingsId: string): Promise<AffiliateProgramSettings | null>;
	abstract findByMarketCode(marketCode: IMarketCode): Promise<AffiliateProgramSettings | null>;
}
