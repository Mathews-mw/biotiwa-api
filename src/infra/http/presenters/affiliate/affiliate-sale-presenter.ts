import type { IPaginationResponse } from '@/core/interfaces/paginating-interfaces';
import type { IListAffiliateSalesResponse } from '../../schemas/affiliates/list-affiliate-sales-schema';
import type { IAffiliateSale } from '@/domains/main/application/modules/affiliates/repositories/affiliate-sales-repository';

import { PaginationPresenter } from '../pagination-presenter';

interface Input {
	pagination: IPaginationResponse;
	sales: IAffiliateSale[];
}

export class AffiliateSalePresenter {
	static toHTTP({ pagination, sales }: Input): IListAffiliateSalesResponse {
		return {
			pagination: PaginationPresenter.paginationModeToHTTP(pagination),
			sales: sales.map((sale) => {
				return {
					commission_id: sale.commissionId,
					order_id: sale.orderId,
					promotion_code: sale.promotionCode,
					sale_amount: sale.saleAmount,
					commission_rate: sale.commissionRate,
					commission_amount: sale.commissionAmount,
					commission_status: sale.commissionStatus,
					currency: sale.currency,
					created_at: sale.createdAt,
				};
			}),
		};
	}
}
