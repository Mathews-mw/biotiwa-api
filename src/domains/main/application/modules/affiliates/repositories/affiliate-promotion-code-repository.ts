import { PromotionCode } from '@/domains/main/models/entities/promotion-code';
import { AffiliatePromotionCode } from '@/domains/main/models/entities/affiliate-promotion-code';
import { AffiliatePromotionCodeDetails } from '@/domains/main/models/value-objects/affiliate-promotion-code-details';

export interface ICreateAffiliatePromotionCodeInput {
	affiliatePromotionCode: AffiliatePromotionCode;
	promotionCode: PromotionCode;
}

export abstract class IAffiliatePromotionCodeRepository {
	abstract createWithPromotionCode(input: ICreateAffiliatePromotionCodeInput): Promise<AffiliatePromotionCodeDetails>;
	abstract countActiveByAffiliateId(affiliateId: string): Promise<number>;
	abstract findManyByAffiliateId(affiliateId: string): Promise<AffiliatePromotionCodeDetails[]>;
	abstract findByPromotionCodeId(promotionCodeId: string): Promise<AffiliatePromotionCodeDetails | null>;
}
