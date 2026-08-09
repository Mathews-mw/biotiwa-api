import type { IMarketCode } from '@/core/types/market-code';
import type { ICurrencyCode } from '@/core/types/currency-code';

export type CheckoutMarket = {
	code: IMarketCode;
	currency: ICurrencyCode;
	shippingAmount: number;
	taxRate: number;
};

export type CheckoutOfferItem = {
	id: string;
	productId: string;
	productName: string;
	quantity: number;
};

export type CheckoutOffer = {
	id: string;
	slug: string;
	marketCode: IMarketCode;
	name: string;
	description: string;
	unitAmount: number;
	discountPercent: number;
	items: CheckoutOfferItem[];
};

export type CheckoutOrderBump = {
	id: string;
	marketCode: IMarketCode;
	name: string;
	description: string;
	unitAmount: number;
	quantity: number;
} | null;

export type CheckoutCatalogSelection = {
	market: CheckoutMarket;
	offer: CheckoutOffer;
	orderBump: CheckoutOrderBump;
};

export abstract class ICheckoutCatalogRepository {
	abstract findSelection(input: {
		marketCode: IMarketCode;
		offerId: string;
		includeOrderBump: boolean;
	}): Promise<CheckoutCatalogSelection | null>;
}
