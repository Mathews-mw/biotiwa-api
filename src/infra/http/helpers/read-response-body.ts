export async function readResponseBody(response: Response) {
	const contentType = response.headers.get('content-type');

	if (contentType?.includes('application/json')) {
		return response.json();
	}

	return response.text();
}
