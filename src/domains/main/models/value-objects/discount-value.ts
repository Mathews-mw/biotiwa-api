import { ValueObject } from '@/core/entities/value-object';
import { IPromotionDiscountType } from '../entities/promotion-code';

interface PromotionDiscountProps {
	type: IPromotionDiscountType;
	value: number;
}

export class PromotionDiscount extends ValueObject<PromotionDiscountProps> {
	get type() {
		return this.props.type;
	}

	get value() {
		return this.props.value;
	}

	calculate(baseAmount: number) {
		if (baseAmount <= 0) {
			return 0;
		}

		if (this.type === 'FIXED') {
			return Math.min(this.value, baseAmount);
		}

		// value / 10² => Os valores são registrados em centavos.
		// Antes, devemos transformar para  real (1ª /100) e depois tirar a porcentagem (2ª /100)
		const discount = Math.round(baseAmount * (this.value / Math.pow(100, 2)));

		return Math.min(discount, baseAmount);
	}

	static create(props: PromotionDiscountProps) {
		if (props.value <= 0) {
			throw new Error('Promotion discount must be greater than zero.');
		}

		if (props.type === 'PERCENTAGE' && props.value > 10_000) {
			throw new Error('Percentage discount cannot exceed 100%.');
		}

		return new PromotionDiscount(props);
	}
}
