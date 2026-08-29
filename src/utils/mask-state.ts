export function maskState(state?: string) {
	if (!state) {
		return null;
	}

	if (state.length <= 12) {
		return `${state.slice(0, 4)}...`;
	}

	return `${state.slice(0, 6)}...${state.slice(-6)}`;
}
