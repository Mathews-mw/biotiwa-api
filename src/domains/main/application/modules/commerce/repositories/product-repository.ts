import { Product } from '@/domains/main/models/entities/product';

export interface IProductRepository {
	create(product: Product): Promise<void>;
	update(product: Product): Promise<void>;
	delete(product: Product): Promise<void>;
	findMany(): Promise<Product[]>;
	findById(id: string): Promise<Product | null>;
}
