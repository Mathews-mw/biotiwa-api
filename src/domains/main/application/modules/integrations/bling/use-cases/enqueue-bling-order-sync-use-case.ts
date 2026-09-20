import { inject, injectable } from 'tsyringe';

import type { IBlingOrderSyncRepository } from '../repositories/bling-order-sync-repository';

import { success, type Outcome } from '@/core/outcome';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { BlingOrderSync } from '@/domains/main/models/entities/integrations/bling-order-sync';

interface IRequest {
	orderId: string;
}

type Response = Outcome<
	never,
	{
		sync: BlingOrderSync;
	}
>;

@injectable()
export class EnqueueBlingOrderSyncUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.BLING_ORDER_SYNC_REPOSITORY)
		private blingOrderSyncRepository: IBlingOrderSyncRepository
	) {}

	async execute({ orderId }: IRequest): Promise<Response> {
		const sync = await this.blingOrderSyncRepository.createPendingIfNotExists({
			orderId,
		});

		return success({
			sync,
		});
	}
}
