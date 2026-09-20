export function onlyDigits(value: string) {
	const digits = value.replace(/\D/g, '');

	return digits;
}
