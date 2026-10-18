interface ICalculateAffiliateCommissionInput {
	itemsAmount: number;
	orderBumpAmount: number;
	discountAmount: number;
	commissionRate: number;
}

interface ICalculateAffiliateCommissionOutput {
	commissionBaseAmount: number;
	commissionAmount: number;
}

export function calculateAffiliateCommission({
	itemsAmount,
	orderBumpAmount,
	discountAmount,
	commissionRate,
}: ICalculateAffiliateCommissionInput): ICalculateAffiliateCommissionOutput {
	const productsAmount = itemsAmount + orderBumpAmount;

	// Regra: produtos após descontos, sem frete, sem impostos
	const commissionBaseAmount = Math.max(0, productsAmount - discountAmount);

	const commissionAmount = Math.round(commissionBaseAmount * (commissionRate / 10_000));

	return {
		commissionBaseAmount,
		commissionAmount,
	};
}
