// OBS.: Use case será usado de forma temporária para testes

import { inject, injectable } from 'tsyringe';

import type { IBlingContactPersonType, IBlingGateway } from '@/services/bling/repositories/bling-gateway';

import { failure, success, type Outcome } from '@/core/outcome';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { getBlingErrorMessage } from '@/services/bling/helpers/get-bling-error-message';
import { IBlingAuthentication } from '@/services/bling/repositories/bling-authentication';

interface IRequest {
	contact: {
		id: number;
		name: string;
		document?: string | null;
		personType?: IBlingContactPersonType;
	};
	items: Array<{
		sku: string;
		name: string;
		quantity: number;
		unitAmount: number;
		discountAmount?: number;
	}>;
	shippingAmount?: number;
	discountAmount?: number;
	externalOrderId: string;
	notes?: string | null;
}

type Response = Outcome<
	BadRequestError,
	{
		blingSalesOrderId: number;
		rawPayload: unknown;
	}
>;

@injectable()
export class CreateBlingSalesOrderUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.BLING_GATEWAY_SERVICE)
		private blingGateway: IBlingGateway,
		@inject(DEPENDENCY_IDENTIFIERS.BLING_AUTHENTICATION)
		private blingAuthentication: IBlingAuthentication
	) {}

	async execute(input: IRequest): Promise<Response> {
		const tokenResult = await this.blingAuthentication.getValidBlingAccessToken({});

		try {
			const itemsWithBlingProducts = await Promise.all(
				input.items.map(async (item) => {
					const product = await this.blingGateway.findProductBySku({
						accessToken: tokenResult.accessToken,
						sku: item.sku,
					});

					if (!product) {
						throw new Error(`Bling product not found for SKU ${item.sku}`);
					}

					return {
						...item,
						blingProductId: product.id,
					};
				})
			);

			const salesOrder = await this.blingGateway.createSalesOrder({
				accessToken: tokenResult.accessToken,
				contact: input.contact,
				items: itemsWithBlingProducts,
				shippingAmount: input.shippingAmount,
				discountAmount: input.discountAmount,
				externalOrderId: input.externalOrderId,
				notes: input.notes,
			});

			return success({
				blingSalesOrderId: salesOrder.id,
				rawPayload: salesOrder.rawPayload,
			});
		} catch (error) {
			console.log('Create bling sales order error: ', error);

			return failure(new BadRequestError(getBlingErrorMessage(error), 'BLING_CREATE_SALES_ORDER_FAILED'));
		}
	}
}
