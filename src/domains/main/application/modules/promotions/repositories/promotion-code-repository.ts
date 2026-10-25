import { PromotionCode } from '@/domains/main/models/entities/promotion-code';

export abstract class IPromotionCodeRepository {
	abstract findByCode(code: string): Promise<PromotionCode | null>;
}
