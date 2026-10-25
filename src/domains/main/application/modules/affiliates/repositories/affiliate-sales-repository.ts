import type { ICurrencyCode } from '@/core/types/currency-code';
import type { IPaginationParams, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';
import type { IAffiliateCommissionStatus } from '@/domains/main/models/entities/affiliate-commission';

export interface IAffiliateSale {
	commissionId: string;
	orderId: string;
	promotionCode: string;
	saleAmount: number;
	commissionRate: number;
	commissionAmount: number;
	commissionStatus: IAffiliateCommissionStatus;
	currency: ICurrencyCode;
	createdAt: Date;
}

export interface IListAffiliateSalesInput extends IPaginationParams {
	affiliateId: string;
	commissionStatus?: IAffiliateCommissionStatus;
	currency?: ICurrencyCode;
}

export interface IListAffiliateSalesOutput {
	pagination: IPaginationResponse;
	items: IAffiliateSale[];
}

export abstract class IAffiliateSalesRepository {
	abstract list(input: IListAffiliateSalesInput): Promise<IListAffiliateSalesOutput>;
}
