export function getShippingErrorMessage(error: unknown) {
	if (error instanceof Error) {
		return error.message;
	}

	return 'Could not calculate shipping rates';
}
