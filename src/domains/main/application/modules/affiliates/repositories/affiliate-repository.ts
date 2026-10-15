import { Affiliate } from '@/domains/main/models/entities/affiliate';

export abstract class IAffiliateRepository {
	abstract create(affiliate: Affiliate): Promise<void>;
	abstract save(affiliate: Affiliate): Promise<void>;
	abstract findById(id: string): Promise<Affiliate | null>;
	abstract findByUserId(userId: string): Promise<Affiliate | null>;
}
