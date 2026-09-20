import { gramsToKg } from '@/utils/grams-to-kg';
import { centsToDecimal } from '@/utils/cents-to-decimal';
import { millimetersToCm } from '@/utils/millimeters-to-cm';
import { NoShippingProfileError } from '../errors/no-shipping-profile-error';
import { CartDetails } from '@/domains/main/models/value-objects/cart-details';

export function buildShippingProductsFromCart(cart: CartDetails) {
	const products: Array<{
		id: string;
		widthInCm: number;
		heightInCm: number;
		lengthInCm: number;
		weightInKg: number;
		insuranceValue: number;
		quantity: number;
	}> = [];

	for (const item of cart.items) {
		if (item.type === 'OFFER' && item.offer) {
			for (const offerItem of item.offer.items) {
				const product = offerItem.product;

				if (!product.productShippingProfile) {
					throw new NoShippingProfileError('This product has no shipping profile');
				}

				products.push({
					id: product.sku,
					widthInCm: millimetersToCm(product.productShippingProfile.widthInMillimeters),
					heightInCm: millimetersToCm(product.productShippingProfile.heightInMillimeters),
					lengthInCm: millimetersToCm(product.productShippingProfile.lengthInMillimeters),
					weightInKg: gramsToKg(product.productShippingProfile.weightInGrams),
					insuranceValue: centsToDecimal(item.offer.unitAmount),
					quantity: offerItem.quantity * item.quantity,
				});
			}
		}

		if (item.type === 'ORDER_BUMP' && item.orderBump) {
			const product = item.orderBump.product;

			if (!product.productShippingProfile) {
				throw new NoShippingProfileError('This product has no shipping profile');
			}

			products.push({
				id: product.sku,
				widthInCm: millimetersToCm(product.productShippingProfile.widthInMillimeters),
				heightInCm: millimetersToCm(product.productShippingProfile.heightInMillimeters),
				lengthInCm: millimetersToCm(product.productShippingProfile.lengthInMillimeters),
				weightInKg: gramsToKg(product.productShippingProfile.weightInGrams),
				insuranceValue: centsToDecimal(item.orderBump.unitAmount),
				quantity: item.orderBump.quantity * item.quantity,
			});
		}
	}

	return products;
}
