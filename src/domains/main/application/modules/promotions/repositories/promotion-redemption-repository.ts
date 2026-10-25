import { PromotionRedemption } from '@/domains/main/models/entities/promotion-redemption';

export interface ICountPromotionUsagesInput {
	promotionCodeId: string;
}

export interface ICountPromotionUsagesByCustomerInput {
	promotionCodeId: string;
	userId: string;
}

export abstract class IPromotionRedemptionRepository {
	abstract save(promotionRedemption: PromotionRedemption): Promise<void>;
	/**
	 * Reserved aqui significa PENDING ou REDEEMED, ou seja, não expirado e não cancelado.
	 * A ideia é contar quantas vezes o código foi usado, mas ainda não foi finalizado (expirado ou cancelado).
	 */
	abstract countReservedUsages(input: ICountPromotionUsagesInput): Promise<number>; //
	abstract countReservedUsagesByCustomer(input: ICountPromotionUsagesByCustomerInput): Promise<number>;
	abstract findByOrderId(orderId: string): Promise<PromotionRedemption | null>;
}
