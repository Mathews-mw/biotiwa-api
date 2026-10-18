import type { IAffiliateDashboardData } from '@/domains/main/application/modules/affiliates/repositories/affiliate-dashboard-repository';

import { Affiliate } from '@/domains/main/models/entities/affiliate';
import { IGetAffiliateDashboardResponse } from '../../schemas/affiliates/get-affiliate-dashboard-schema';

interface Input {
	affiliate: Affiliate;
	dashboard: IAffiliateDashboardData;
}

export class AffiliateDashboardPresenter {
	static toHTTP({ affiliate, dashboard }: Input): IGetAffiliateDashboardResponse {
		const salesCount = dashboard.financials.reduce((total, financial) => total + financial.salesCount, 0);

		return {
			affiliate: {
				id: affiliate.id.toString(),
				type: affiliate.type,
				status: affiliate.status,
			},
			sales_count: salesCount,
			financials: dashboard.financials.map((financial) => ({
				currency: financial.currency,
				sales_count: financial.salesCount,
				sales_amount: financial.salesAmount,
				commission_amount: financial.commissionAmount,
				pending_amount: financial.pendingAmount,
				available_amount: financial.availableAmount,
				paid_amount: financial.paidAmount,
			})),
			promotion_codes: {
				total: dashboard.promotionCodes.total,
				active: dashboard.promotionCodes.active,
			},
		};
	}
}
