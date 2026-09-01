export function getBlingErrorMessage(error: unknown) {
	if (error instanceof Error) {
		return error.message;
	}

	return 'Could not create Bling sales order';
}
