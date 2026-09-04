import 'reflect-metadata';
import '@/shared/di/containers/index';

import { container } from 'tsyringe';

import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { ProcessBlingOrderSyncBatchUseCase } from '@/domains/main/application/modules/integrations/bling/use-cases/process-bling-order-sync-batch-use-case';

async function main() {
	const useCase = container.resolve<ProcessBlingOrderSyncBatchUseCase>(
		DEPENDENCY_IDENTIFIERS.PROCESS_BLING_ORDER_SYNC_BATCH_USE_CASE
	);

	const result = await useCase.execute({
		limit: 5,
	});

	console.log(JSON.stringify(result.value, null, 2));
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
