import type {
	IAffiliateRepository,
	IListingAffiliateOutput,
	IListingAffiliatesInput,
} from '@/domains/main/application/modules/affiliates/repositories/affiliate-repository';

import { prisma } from '../../prisma';
import { Prisma } from '@/generated/prisma/client';
import { Affiliate } from '@/domains/main/models/entities/affiliate';
import { AffiliateMapper } from '../../mappers/affiliates/affiliate-mapper';
import { AffiliateDetailsMapper } from '../../mappers/affiliates/affiliate-details-mapper';

export class PrismaAffiliateRepository implements IAffiliateRepository {
	async create(affiliate: Affiliate) {
		const data = AffiliateMapper.toPrisma(affiliate);

		await prisma.affiliate.create({
			data,
		});
	}

	async save(affiliate: Affiliate) {
		await prisma.affiliate.update({
			where: {
				id: affiliate.id.toString(),
			},

			data: {
				type: affiliate.type,
				status: affiliate.status,
				updatedAt: affiliate.updatedAt,
			},
		});
	}

	async listing({ page, perPage, status }: IListingAffiliatesInput): Promise<IListingAffiliateOutput> {
		const query: Prisma.AffiliateFindManyArgs = {
			where: {
				status,
			},
		};

		const isPerPageNumber = typeof perPage === 'number';

		const [affiliates, count] = await Promise.all([
			prisma.affiliate.findMany({
				where: query.where,
				include: {
					user: true,
				},
				orderBy: {
					createdAt: 'desc',
				},
				take: isPerPageNumber ? perPage : undefined,
				skip: isPerPageNumber ? (page - 1) * perPage : undefined,
			}),

			prisma.affiliate.count({
				where: query.where,
			}),
		]);

		let _perPage = isPerPageNumber ? perPage : 10;

		if (perPage === 'all') {
			_perPage = count;
		}

		const totalPages = Math.ceil(count / _perPage);

		const pagination = {
			page,
			perPage: _perPage,
			totalPages,
			totalOccurrences: count,
		};

		return {
			pagination,
			affiliates: affiliates.map((affiliate) => {
				return AffiliateDetailsMapper.toDomain({
					affiliate,
					user: affiliate.user,
				});
			}),
		};
	}

	async findById(id: string): Promise<Affiliate | null> {
		const affiliate = await prisma.affiliate.findUnique({
			where: {
				id: id.toString(),
			},
		});

		if (!affiliate) {
			return null;
		}

		return AffiliateMapper.toDomain(affiliate);
	}

	async findByUserId(userId: string): Promise<Affiliate | null> {
		const affiliate = await prisma.affiliate.findUnique({
			where: {
				userId: userId.toString(),
			},
		});

		if (!affiliate) {
			return null;
		}

		return AffiliateMapper.toDomain(affiliate);
	}
}
