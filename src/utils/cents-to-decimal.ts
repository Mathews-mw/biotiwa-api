export function centsToDecimal(amountInCents: number) {
	return Number((amountInCents / 100).toFixed(2));
}
