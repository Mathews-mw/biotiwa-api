import type {
	IAffiliateDashboardRepository,
	IAffiliateDashboardFinancial,
} from '@/domains/main/application/modules/affiliates/repositories/affiliate-dashboard-repository';

import { prisma } from '../../prisma';

export class PrismaAffiliateDashboardRepository implements IAffiliateDashboardRepository {
	async getDashboard(affiliateId: string) {
		const affiliateIdValue = affiliateId.toString();

		const [commissions, totalPromotionCodes, activePromotionCodes] = await Promise.all([
			prisma.affiliateCommission.findMany({
				where: {
					affiliateId: affiliateIdValue,
				},
				select: {
					currency: true,
					status: true,
					commissionBaseAmount: true,
					commissionAmount: true,
				},
			}),

			prisma.affiliatePromotionCode.count({
				where: {
					affiliateId: affiliateIdValue,
				},
			}),

			prisma.affiliatePromotionCode.count({
				where: {
					affiliateId: affiliateIdValue,
					promotionCode: {
						status: 'ACTIVE',
						OR: [
							{
								expiresAt: null,
							},
							{
								expiresAt: {
									gt: new Date(),
								},
							},
						],
					},
				},
			}),
		]);

		const financialsByCurrency = new Map<string, IAffiliateDashboardFinancial>();

		for (const commission of commissions) {
			if (commission.status === 'CANCELED') {
				continue;
			}

			const current = financialsByCurrency.get(commission.currency) ?? {
				currency: commission.currency,
				salesCount: 0,
				salesAmount: 0,
				commissionAmount: 0,
				pendingAmount: 0,
				availableAmount: 0,
				paidAmount: 0,
			};

			current.salesCount += 1;
			current.salesAmount += commission.commissionBaseAmount;
			current.commissionAmount += commission.commissionAmount;

			switch (commission.status) {
				case 'PENDING':
					current.pendingAmount += commission.commissionAmount;
					break;

				case 'AVAILABLE':
					current.availableAmount += commission.commissionAmount;
					break;

				case 'PAID':
					current.paidAmount += commission.commissionAmount;
					break;
			}

			financialsByCurrency.set(commission.currency, current);
		}

		return {
			financials: Array.from(financialsByCurrency.values()),
			promotionCodes: {
				total: totalPromotionCodes,
				active: activePromotionCodes,
			},
		};
	}
}
