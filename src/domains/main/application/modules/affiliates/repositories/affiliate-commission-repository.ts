import { AffiliateCommission } from '@/domains/main/models/entities/affiliate-commission';

export abstract class IAffiliateCommissionRepository {
	abstract create(commission: AffiliateCommission): Promise<void>;
	abstract save(commission: AffiliateCommission): Promise<void>;
	abstract saveMany(commissions: AffiliateCommission[]): Promise<void>;
	abstract findPendingEligibleForRelease(now: Date): Promise<AffiliateCommission[]>;
	abstract findByOrderId(orderId: string): Promise<AffiliateCommission | null>;
}
