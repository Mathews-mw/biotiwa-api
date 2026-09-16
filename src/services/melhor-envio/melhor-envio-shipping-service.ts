import { env } from '@/env';

import type {
	ICalculateShippingRatesInput,
	IShippingRate,
	IShippingService,
} from '../shipping/repositories/shipping-service';

import { onlyDigits } from '@/utils/only-digits';
import { MelhorEnvioHelpers } from './melhor-envio-helpers';
import { decimalStringToCents } from '@/utils/decimal-string-to-cents';

type IMelhorEnvioRateResponse = Array<{
	id?: number | string;
	name?: string;
	price?: string;
	custom_price?: string;
	delivery_time?: number;
	delivery_range?: {
		min: number;
		max: number;
	};
	custom_delivery_time?: number;
	custom_delivery_range?: {
		min: number;
		max: number;
	};
	company?: {
		id?: number | string;
		name?: string;
		picture?: string;
	};
	error?: string;
}>;

export class MelhorEnvioShippingService extends MelhorEnvioHelpers implements IShippingService {
	async calculateRates(input: ICalculateShippingRatesInput): Promise<IShippingRate[]> {
		const bodyRequest = {
			from: {
				postal_code: onlyDigits(input.fromPostalCode),
			},
			to: {
				postal_code: onlyDigits(input.toPostalCode),
			},
			products: input.products.map((product) => ({
				id: product.id,
				width: product.widthInCm,
				height: product.heightInCm,
				length: product.lengthInCm,
				weight: product.weightInKg,
				insurance_value: product.insuranceValue, //BRL
				quantity: product.quantity, //unidade de produto
			})),
			options: {
				receipt: false,
				own_hand: false,
			},
			services: input.services ?? env.MELHOR_ENVIO_SERVICES,
		};

		const ratesResponse = await this.request<IMelhorEnvioRateResponse>({
			method: 'POST',
			path: '/api/v2/me/shipment/calculate',
			accessToken: input.accessToken,
			body: bodyRequest,
		});

		return ratesResponse
			.filter((rate) => !rate.error)
			.map((rate) => {
				const price = rate.custom_price ?? rate.price;

				return {
					provider: 'MELHOR_ENVIO',
					serviceId: String(rate.id),
					serviceName: rate.name ?? 'Frete',
					carrierName: rate.company?.name ?? null,
					amount: decimalStringToCents(price),
					currency: 'BRL',
					estimatedDays: rate.custom_delivery_time ?? rate.delivery_time ?? null,
					companyPicture: rate.company?.picture ?? null,
					rawPayload: rate,
				} satisfies IShippingRate;
			})
			.filter((rate) => rate.amount > 0);
	}
}
