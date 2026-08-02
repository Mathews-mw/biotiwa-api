import { prisma } from '../../prisma';
import { OfferMapper } from '../../mappers/offer-mapper';
import { Offer } from '@/domains/main/models/entities/offer';

import type {
	IFindManyParams,
	IOfferRepository,
} from '@/domains/main/application/modules/commerce/repositories/offer-repository';

export class PrismaOffersRepository implements IOfferRepository {
	async create(offer: Offer) {
		const data = OfferMapper.toPrisma(offer);

		await prisma.offer.create({
			data,
		});
	}

	async update(offer: Offer) {
		const data = OfferMapper.toPrisma(offer);

		await prisma.offer.update({
			data,
			where: {
				id: data.id,
			},
		});
	}

	async delete(offer: Offer) {
		await prisma.offer.delete({
			where: {
				id: offer.id.toString(),
			},
		});
	}

	async findMany(params?: IFindManyParams): Promise<Offer[]> {
		const { status, marketCode } = params || {};

		const offers = await prisma.offer.findMany({
			where: {
				marketCode,
				status,
			},
			orderBy: {
				sortOrder: 'asc',
			},
		});

		return offers.map(OfferMapper.toDomain);
	}

	async findById(id: string) {
		const offer = await prisma.offer.findUnique({
			where: {
				id,
			},
		});

		if (!offer) {
			return null;
		}

		return OfferMapper.toDomain(offer);
	}

	async findBySlug(slug: string): Promise<Offer | null> {
		const offer = await prisma.offer.findFirst({
			where: {
				slug,
			},
		});

		if (!offer) {
			return null;
		}

		return OfferMapper.toDomain(offer);
	}
}
