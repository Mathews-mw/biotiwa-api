import type { IShippingProvider } from '@/domains/main/models/entities/shipping-quote-rate';

export interface ICalculateShippingRatesInput {
	accessToken: string;
	fromPostalCode: string;
	toPostalCode: string;
	products: Array<{
		id: string;
		widthInCm: number;
		heightInCm: number;
		lengthInCm: number;
		weightInKg: number;
		insuranceValue: number;
		quantity: number;
	}>;
	services?: string | null;
}

export interface IShippingRate {
	provider: IShippingProvider;
	serviceId: string;
	serviceName: string;
	carrierName: string | null;
	amount: number;
	currency: 'BRL';
	companyPicture: string | null;
	estimatedDays: number | null;
	rawPayload: unknown;
}

export interface IShippingService {
	calculateRates(input: ICalculateShippingRatesInput): Promise<IShippingRate[]>;
}
