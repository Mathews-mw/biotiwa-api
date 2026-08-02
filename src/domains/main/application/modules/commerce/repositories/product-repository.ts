import { IProductStatus, Product } from '@/domains/main/models/entities/product';

export interface IFindManyParams {
	status?: IProductStatus;
}

export interface IProductRepository {
	create(product: Product): Promise<void>;
	update(product: Product): Promise<void>;
	delete(product: Product): Promise<void>;
	findMany(params?: IFindManyParams): Promise<Product[]>;
	findById(id: string): Promise<Product | null>;
	findBySlug(slug: string): Promise<Product | null>;
}
