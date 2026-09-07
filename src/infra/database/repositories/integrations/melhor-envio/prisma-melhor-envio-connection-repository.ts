import type {
	IMelhorEnvioConnectionRepository,
	IUpsertActiveMelhorEnvioConnectionInput,
} from '@/domains/main/application/modules/integrations/melhor-envio/repositories/melhor-envio-connection-repository';

import { prisma } from '@/infra/database/prisma';
import { MelhorEnvioConnection } from '@/domains/main/models/entities/integrations/melhor-envio-connection';
import { MelhorEnvioConnectionMapper } from '@/infra/database/mappers/integrations/melhor-envio/melhor-envio-connection-mapper';

export class PrismaMelhorEnvioConnectionRepository implements IMelhorEnvioConnectionRepository {
	async save(connection: MelhorEnvioConnection): Promise<MelhorEnvioConnection> {
		const updatedConnection = await prisma.melhorEnvioConnection.update({
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

		return MelhorEnvioConnectionMapper.toDomain(updatedConnection);
	}

	async upsertActive(input: IUpsertActiveMelhorEnvioConnectionInput): Promise<MelhorEnvioConnection> {
		const connection = await prisma.$transaction(async (tx) => {
			const currentActiveConnection = await tx.melhorEnvioConnection.findFirst({
				where: {
					status: 'ACTIVE',
				},
				orderBy: {
					updatedAt: 'desc',
				},
			});

			const savedConnection = currentActiveConnection
				? await tx.melhorEnvioConnection.update({
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
					})
				: await tx.melhorEnvioConnection.create({
						data: {
							status: 'ACTIVE',
							accessToken: input.accessToken,
							refreshToken: input.refreshToken,
							expiresAt: input.expiresAt,
							scope: input.scope ?? null,
						},
					});

			await tx.melhorEnvioConnection.updateMany({
				where: {
					id: {
						not: savedConnection.id,
					},
					status: 'ACTIVE',
				},
				data: {
					status: 'REVOKED',
				},
			});

			return savedConnection;
		});

		return MelhorEnvioConnectionMapper.toDomain(connection);
	}

	async findActive(): Promise<MelhorEnvioConnection | null> {
		const connection = await prisma.melhorEnvioConnection.findFirst({
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

		return MelhorEnvioConnectionMapper.toDomain(connection);
	}
}
