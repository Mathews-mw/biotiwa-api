import type {
	IBlingConnectionRepository,
	IUpsertActiveBlingConnectionInput,
} from '@/domains/main/application/modules/integrations/bling/repositories/bling-connection-repository';

import type { BlingConnection as PrismaBlingConnection } from '@/generated/prisma/client';

import { prisma } from '@/infra/database/prisma';
import { BlingConnection } from '@/domains/main/models/entities/integrations/bling-connection';
import { BlingConnectionMapper } from '@/infra/database/mappers/integrations/bling-connection-mapper';

export class PrismaBlingConnectionRepository implements IBlingConnectionRepository {
	async save(connection: BlingConnection): Promise<BlingConnection> {
		const updatedConnection = await prisma.blingConnection.update({
			where: {
				id: connection.id.toString(),
			},
			data: {
				status: connection.status,
				accessToken: connection.accessToken,
				refreshToken: connection.refreshToken,
				expiresAt: connection.expiresAt,
				scope: connection.scope ?? null,
				updatedAt: connection.updatedAt,
			},
		});

		return BlingConnectionMapper.toDomain(updatedConnection);
	}

	async upsertActive(input: IUpsertActiveBlingConnectionInput): Promise<BlingConnection> {
		const connection = await prisma.$transaction(async (tx) => {
			const currentActiveConnection = await tx.blingConnection.findFirst({
				where: {
					status: 'ACTIVE',
				},
				orderBy: {
					updatedAt: 'desc',
				},
			});

			let savedConnection: PrismaBlingConnection;

			if (currentActiveConnection) {
				savedConnection = await tx.blingConnection.update({
					where: {
						id: currentActiveConnection.id,
					},
					data: {
						status: 'ACTIVE',
						accessToken: input.accessToken,
						refreshToken: input.refreshToken,
						expiresAt: input.expiresAt,
						scope: input.scope ?? null,
					},
				});
			} else {
				savedConnection = await tx.blingConnection.create({
					data: {
						status: 'ACTIVE',
						accessToken: input.accessToken,
						refreshToken: input.refreshToken,
						expiresAt: input.expiresAt,
						scope: input.scope ?? null,
					},
				});
			}

			await tx.blingConnection.updateMany({
				where: {
					status: 'ACTIVE',
					id: {
						not: savedConnection.id,
					},
				},
				data: {
					status: 'REVOKED',
				},
			});

			return savedConnection;
		});

		return BlingConnectionMapper.toDomain(connection);
	}

	async findActive(): Promise<BlingConnection | null> {
		const connection = await prisma.blingConnection.findFirst({
			where: {
				status: 'ACTIVE',
			},
			orderBy: {
				updatedAt: 'desc',
			},
		});

		if (!connection) {
			return null;
		}

		return BlingConnectionMapper.toDomain(connection);
	}
}
