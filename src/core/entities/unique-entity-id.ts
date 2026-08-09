import { createCuId } from '../cuid-generator';

export class UniqueEntityId {
	private value: string;

	constructor(value?: string) {
		this.value = value ?? createCuId();
	}

	toString() {
		return this.value;
	}

	toValue() {
		return this.value;
	}

	equals(id: UniqueEntityId) {
		return this.toValue() === id.value;
	}
}
