import { prisma } from '@/infra/database/prisma';
import { Prisma } from '@/generated/prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BlingOrderSync } from '@/domains/main/models/entities/integrations/bling-order-sync';
import { BlingOrderSyncMapper } from '@/infra/database/mappers/integrations/bling/bling-order-sync-mapper';

import type { IBlingOrderSyncRepository } from '@/domains/main/application/modules/integrations/bling/repositories/bling-order-sync-repository';
import blingConfig from '@/config/bling-config';

export class PrismaBlingOrderSyncRepository implements IBlingOrderSyncRepository {
	async create(sync: BlingOrderSync): Promise<BlingOrderSync> {
		const createdSync = await prisma.blingOrderSync.create({
			data: {
				id: sync.id.toString(),
				orderId: sync.orderId.toString(),
				status: sync.status,
				blingContactId: sync.blingContactId,
				blingOrderId: sync.blingOrderId,
				attempts: sync.attempts,
				lastErrorMessage: sync.lastErrorMessage,
				requestPayload:
					sync.requestPayload === undefined ? Prisma.JsonNull : (sync.requestPayload as Prisma.InputJsonValue),
				responsePayload:
					sync.responsePayload === undefined ? Prisma.JsonNull : (sync.responsePayload as Prisma.InputJsonValue),
				syncedAt: sync.syncedAt,
				createdAt: sync.createdAt,
				updatedAt: sync.updatedAt,
			},
		});

		return BlingOrderSyncMapper.toDomain(createdSync);
	}

	async save(sync: BlingOrderSync): Promise<BlingOrderSync> {
		const updatedSync = await prisma.blingOrderSync.update({
			where: {
				id: sync.id.toString(),
			},
			data: {
				status: sync.status,
				blingContactId: sync.blingContactId,
				blingOrderId: sync.blingOrderId,
				attempts: sync.attempts,
				lastErrorMessage: sync.lastErrorMessage,
				requestPayload:
					sync.requestPayload === undefined ? Prisma.JsonNull : (sync.requestPayload as Prisma.InputJsonValue),
				responsePayload:
					sync.responsePayload === undefined ? Prisma.JsonNull : (sync.responsePayload as Prisma.InputJsonValue),
				syncedAt: sync.syncedAt,
				updatedAt: sync.updatedAt,
			},
		});

		return BlingOrderSyncMapper.toDomain(updatedSync);
	}

	async createPendingIfNotExists(input: { orderId: string }): Promise<BlingOrderSync> {
		const existingSync = await this.findByOrderId(input.orderId);

		if (existingSync) {
			return existingSync;
		}

		const sync = BlingOrderSync.create({
			orderId: new UniqueEntityId(input.orderId),
		});

		try {
			return await this.create(sync);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
				const createdByAnotherRequest = await this.findByOrderId(input.orderId);

				if (createdByAnotherRequest) {
					return createdByAnotherRequest;
				}
			}

			throw error;
		}
	}

	async findByOrderId(orderId: string): Promise<BlingOrderSync | null> {
		const sync = await prisma.blingOrderSync.findUnique({
			where: {
				orderId: orderId.toString(),
			},
		});

		if (!sync) {
			return null;
		}

		return BlingOrderSyncMapper.toDomain(sync);
	}

	async claimNextPendingOrFailed(): Promise<BlingOrderSync | null> {
		const staleCutoff = new Date(Date.now() - blingConfig.BLING_SYNC_PROCESSING_STALE_AFTER_IN_MS);

		const sync = await prisma.blingOrderSync.findFirst({
			where: {
				attempts: {
					lt: blingConfig.MAX_BLING_SYNC_ATTEMPTS,
				},
				OR: [
					{
						status: {
							in: ['PENDING', 'FAILED'],
						},
					},
					{
						status: 'PROCESSING',
						updatedAt: {
							lte: staleCutoff,
						},
					},
				],
			},
			orderBy: {
				createdAt: 'asc',
			},
		});

		if (!sync) {
			return null;
		}

		const claimed = await prisma.blingOrderSync.updateMany({
			where: {
				id: sync.id,
				attempts: {
					lt: blingConfig.MAX_BLING_SYNC_ATTEMPTS,
				},
				OR: [
					{
						status: {
							in: ['PENDING', 'FAILED'],
						},
					},
					{
						status: 'PROCESSING',
						updatedAt: {
							lte: staleCutoff,
						},
					},
				],
			},
			data: {
				status: 'PROCESSING',
				attempts: {
					increment: 1,
				},
				lastErrorMessage: null,
				updatedAt: new Date(),
			},
		});

		if (claimed.count === 0) {
			return null;
		}

		const claimedSync = await prisma.blingOrderSync.findUniqueOrThrow({
			where: {
				id: sync.id,
			},
		});

		return BlingOrderSyncMapper.toDomain(claimedSync);
	}
}
