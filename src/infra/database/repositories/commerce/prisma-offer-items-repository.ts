import { prisma } from '../../prisma';
import { OfferItemMapper } from '../../mappers/offer-item-mapper';
import { OfferItem } from '@/domains/main/models/entities/offer-item';

import type { IOfferItemRepository } from '@/domains/main/application/modules/commerce/repositories/offer-item-repository';

export class PrismaOfferItemsRepository implements IOfferItemRepository {
	async create(offerItem: OfferItem) {
		const data = OfferItemMapper.toPrisma(offerItem);

		await prisma.offerItem.create({
			data,
		});
	}

	async update(offerItem: OfferItem) {
		const data = OfferItemMapper.toPrisma(offerItem);

		await prisma.offerItem.update({
			data,
			where: {
				id: data.id,
			},
		});
	}

	async delete(offerItem: OfferItem) {
		await prisma.offerItem.delete({
			where: {
				id: offerItem.id.toString(),
			},
		});
	}

	async findMany(): Promise<OfferItem[]> {
		const offerItems = await prisma.offerItem.findMany();

		return offerItems.map(OfferItemMapper.toDomain);
	}

	async findById(id: string) {
		const offerItem = await prisma.offerItem.findUnique({
			where: {
				id,
			},
		});

		if (!offerItem) {
			return null;
		}

		return OfferItemMapper.toDomain(offerItem);
	}
}
