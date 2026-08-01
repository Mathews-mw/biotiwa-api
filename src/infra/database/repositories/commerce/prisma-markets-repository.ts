import { prisma } from '../../prisma';
import { MarketMapper } from '../../mappers/market-mapper';
import { Market } from '@/domains/main/models/entities/market';

import type { IMarketRepository } from '@/domains/main/application/modules/commerce/repositories/market-repository';

export class PrismaMarketsRepository implements IMarketRepository {
	async create(market: Market) {
		const data = MarketMapper.toPrisma(market);

		await prisma.market.create({
			data,
		});
	}

	async update(market: Market) {
		const data = MarketMapper.toPrisma(market);

		await prisma.market.update({
			data,
			where: {
				id: data.id,
			},
		});
	}

	async delete(market: Market) {
		await prisma.market.delete({
			where: {
				id: market.id.toString(),
			},
		});
	}

	async findMany(): Promise<Market[]> {
		const markets = await prisma.market.findMany();

		return markets.map(MarketMapper.toDomain);
	}

	async findById(id: string) {
		const market = await prisma.market.findUnique({
			where: {
				id,
			},
		});

		if (!market) {
			return null;
		}

		return MarketMapper.toDomain(market);
	}
}
