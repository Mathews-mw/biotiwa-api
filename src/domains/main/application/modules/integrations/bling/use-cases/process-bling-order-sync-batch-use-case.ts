import { inject, injectable } from 'tsyringe';

import { success, type Outcome } from '@/core/outcome';

import { ProcessNextBlingOrderSyncUseCase } from './process-next-bling-order-sync-use-case';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	limit?: number;
}

interface ProcessedSyncResult {
	processed: boolean;
	syncId?: string;
	orderId?: string;
	status?: string;
	blingContactId?: string | null;
	blingOrderId?: string | null;
	reason?: string;
	error?: string;
}

type Response = Outcome<
	never,
	{
		processedCount: number;
		successCount: number;
		failedCount: number;
		results: ProcessedSyncResult[];
	}
>;

@injectable()
export class ProcessBlingOrderSyncBatchUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.PROCESS_NEXT_BLING_ORDER_SYNC_USE_CASE)
		private readonly processNextBlingOrderSyncUseCase: ProcessNextBlingOrderSyncUseCase
	) {}

	async execute({ limit = 5 }: IRequest = {}): Promise<Response> {
		const safeLimit = Math.min(Math.max(limit, 1), 20);

		const results: ProcessedSyncResult[] = [];

		for (let index = 0; index < safeLimit; index++) {
			const result = await this.processNextBlingOrderSyncUseCase.execute();

			if (result.isFalse()) {
				results.push({
					processed: true,
					error: result.value.message,
				});

				continue;
			}

			if (!result.value.processed) {
				results.push({
					processed: false,
					reason: result.value.reason ?? 'NO_PENDING_BLING_ORDER_SYNC',
				});

				break;
			}

			results.push({
				processed: true,
				syncId: result.value.syncId,
				orderId: result.value.orderId,
				status: result.value.status,
				blingContactId: result.value.blingContactId,
				blingOrderId: result.value.blingOrderId,
			});
		}

		const processedItems = results.filter((item) => item.processed);
		const successCount = results.filter((item) => item.status === 'SYNCED').length;
		const failedCount = results.filter((item) => item.error).length;

		return success({
			processedCount: processedItems.length,
			successCount,
			failedCount,
			results,
		});
	}
}
