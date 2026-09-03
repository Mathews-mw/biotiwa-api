import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BlingOrderSync as PrismaBlingOrderSync } from '@/generated/prisma/client';
import { BlingOrderSync } from '@/domains/main/models/entities/integrations/bling-order-sync';

export class BlingOrderSyncMapper {
	static toDomain(data: PrismaBlingOrderSync): BlingOrderSync {
		return BlingOrderSync.create(
			{
				orderId: new UniqueEntityId(data.orderId),
				status: data.status,
				blingContactId: data.blingContactId,
				blingOrderId: data.blingOrderId,
				attempts: data.attempts,
				lastErrorMessage: data.lastErrorMessage,
				requestPayload: data.requestPayload,
				responsePayload: data.responsePayload,
				syncedAt: data.syncedAt,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: BlingOrderSync): PrismaBlingOrderSync {
		return {
			id: data.id.toString(),
			orderId: data.orderId.toString(),
			status: data.status,
			blingContactId: data.blingContactId ?? null,
			blingOrderId: data.blingOrderId ?? null,
			attempts: data.attempts,
			lastErrorMessage: data.lastErrorMessage ?? null,
			requestPayload: data.requestPayload ?? null,
			responsePayload: data.responsePayload ?? null,
			syncedAt: data.syncedAt ?? null,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
