import { isPlainObject } from './is-plain-object';

export function removeEmptyValues<T extends Record<string, unknown>>(object: T): Partial<T> {
	return Object.fromEntries(
		Object.entries(object)
			.map(([key, value]) => {
				if (isPlainObject(value)) {
					return [key, removeEmptyValues(value)];
				}

				return [key, value];
			})
			.filter(([, value]) => {
				if (value === undefined || value === null || value === '') {
					return false;
				}

				if (isPlainObject(value) && Object.keys(value).length === 0) {
					return false;
				}

				return true;
			})
	) as Partial<T>;
}
