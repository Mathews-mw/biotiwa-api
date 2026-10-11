export interface ICountPromotionUsagesInput {
	promotionCodeId: string;
}

export interface ICountPromotionUsagesByCustomerInput {
	promotionCodeId: string;
	userId: string;
}

export abstract class IPromotionRedemptionRepository {
	abstract countReservedUsages(input: ICountPromotionUsagesInput): Promise<number>; // Reserved aqui significa PENDING ou REDEEMED, ou seja, não expirado e não cancelado. A ideia é contar quantas vezes o código foi usado, mas ainda não foi finalizado (expirado ou cancelado).
	abstract countReservedUsagesByCustomer(input: ICountPromotionUsagesByCustomerInput): Promise<number>;
}
