import type { ICurrencyCode } from '@/core/types/currency-code';

export interface IAffiliateDashboardFinancial {
	currency: ICurrencyCode;
	salesCount: number;
	salesAmount: number;
	commissionAmount: number;
	pendingAmount: number;
	availableAmount: number;
	paidAmount: number;
}

export interface IAffiliateDashboardPromotionCodes {
	total: number;
	active: number;
}

export interface IAffiliateDashboardData {
	financials: IAffiliateDashboardFinancial[];
	promotionCodes: IAffiliateDashboardPromotionCodes;
}

export abstract class IAffiliateDashboardRepository {
	abstract getDashboard(affiliateId: string): Promise<IAffiliateDashboardData>;
}
