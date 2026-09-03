import { BlingOrderSync } from '@/domains/main/models/entities/integrations/bling-order-sync';

export interface IBlingOrderSyncRepository {
	create(sync: BlingOrderSync): Promise<BlingOrderSync>;
	save(sync: BlingOrderSync): Promise<BlingOrderSync>;
	createPendingIfNotExists(input: { orderId: string }): Promise<BlingOrderSync>;
	findByOrderId(orderId: string): Promise<BlingOrderSync | null>;
	claimNextPendingOrFailed(): Promise<BlingOrderSync | null>;
}
