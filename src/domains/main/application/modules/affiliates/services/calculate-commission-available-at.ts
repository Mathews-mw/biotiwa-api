interface ICalculateCommissionAvailableAtInput {
	paidAt: Date;
	holdDays: number;
}

export function calculateCommissionAvailableAt({ paidAt, holdDays }: ICalculateCommissionAvailableAtInput): Date {
	const availableAt = new Date(paidAt.getTime());

	availableAt.setUTCDate(availableAt.getUTCDate() + holdDays);

	return availableAt;
}
