export function decimalStringToCents(value?: string | null) {
	if (!value) {
		return 0;
	}

	const normalized = value.replace(',', '.');

	return Math.round(Number(normalized) * 100);
}
