import { Product } from '@/domains/main/models/entities/product';
import { IProductResponseSchema } from '../../schemas/commerce/product-schema';

export class ProductPresenter {
	static toHTTP(data: Product): IProductResponseSchema {
		return {
			id: data.id.toString(),
			sku: data.sku,
			slug: data.slug,
			name: data.name,
			short_description: data.shortDescription,
			description: data.description,
			image_url: data.imageUrl,
			pills_per_pack: data.pillsPerPack,
			status: data.status,
			created_at: data.createdAt,
			updated_at: data.updatedAt,
		};
	}
}
