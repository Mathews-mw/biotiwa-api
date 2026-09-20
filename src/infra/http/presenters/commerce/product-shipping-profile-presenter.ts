import { ProductShippingProfile } from '@/domains/main/models/entities/product-shipping-profile';
import type { IProductShippingProfileResponseSchema } from '../../schemas/commerce/product-shipping-profile-schema';

export class ProductShippingProfilePresenter {
	static toHTTP(data: ProductShippingProfile): IProductShippingProfileResponseSchema {
		return {
			id: data.id.toString(),
			product_id: data.productId.toString(),
			is_shippable: data.isShippable,
			weight_in_grams: data.weightInGrams,
			width_in_millimeters: data.widthInMillimeters,
			height_in_millimeters: data.heightInMillimeters,
			length_in_millimeters: data.lengthInMillimeters,
			insurance_amount: data.insuranceAmount,
			created_at: data.createdAt,
			updated_at: data.updatedAt,
		};
	}
}
