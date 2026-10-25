import type {
	IAffiliateSalesRepository,
	IListAffiliateSalesInput,
	IListAffiliateSalesOutput,
} from '@/domains/main/application/modules/affiliates/repositories/affiliate-sales-repository';

import { prisma } from '../../prisma';
import { Prisma } from '@/generated/prisma/client';

export class PrismaAffiliateSalesRepository implements IAffiliateSalesRepository {
	async list({
		affiliateId,
		page,
		perPage,
		commissionStatus,
		currency,
	}: IListAffiliateSalesInput): Promise<IListAffiliateSalesOutput> {
		const query: Prisma.AffiliateCommissionFindManyArgs = {
			where: {
				affiliateId,
				status: commissionStatus,
				currency,
			},
		};

		const isPerPageNumber = typeof perPage === 'number';

		const [commissions, count] = await Promise.all([
			prisma.affiliateCommission.findMany({
				where: query.where,
				orderBy: {
					createdAt: 'desc',
				},
				select: {
					id: true,
					orderId: true,
					promotionCode: true,
					commissionBaseAmount: true,
					commissionRate: true,
					commissionAmount: true,
					currency: true,
					status: true,
					createdAt: true,
				},
				take: isPerPageNumber ? perPage : undefined,
				skip: isPerPageNumber ? (page - 1) * perPage : undefined,
			}),

			prisma.affiliateCommission.count({
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
			items: commissions.map((commission) => ({
				commissionId: commission.id,
				orderId: commission.orderId,
				promotionCode: commission.promotionCode,
				saleAmount: commission.commissionBaseAmount,
				commissionRate: commission.commissionRate,
				commissionAmount: commission.commissionAmount,
				commissionStatus: commission.status,
				currency: commission.currency,
				createdAt: commission.createdAt,
			})),
		};
	}
}
