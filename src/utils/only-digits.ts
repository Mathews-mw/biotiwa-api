export function onlyDigits(value?: string | null) {
	if (!value) {
		return undefined;
	}

	const digits = value.replace(/\D/g, '');

	return digits.length > 0 ? digits : undefined;
}
