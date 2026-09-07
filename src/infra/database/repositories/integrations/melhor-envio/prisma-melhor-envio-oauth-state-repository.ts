import { prisma } from '@/infra/database/prisma';

import type { IMelhorEnvioOAuthStateRepository } from '@/domains/main/application/modules/integrations/melhor-envio/repositories/melhor-envio-oauth-state-repository';

export class PrismaMelhorEnvioOAuthStateRepository implements IMelhorEnvioOAuthStateRepository {
	async create(input: { state: string; expiresAt: Date }): Promise<void> {
		await prisma.melhorEnvioOAuthState.create({
			data: {
				state: input.state,
				expiresAt: input.expiresAt,
			},
		});
	}

	async consume(state: string): Promise<boolean> {
		const result = await prisma.melhorEnvioOAuthState.updateMany({
			where: {
				state,
				usedAt: null,
				expiresAt: {
					gt: new Date(),
				},
			},
			data: {
				usedAt: new Date(),
			},
		});

		return result.count === 1;
	}
}
