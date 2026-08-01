import { prisma } from '../../prisma';
import { ProductMapper } from '../../mappers/product-mapper';
import { Product } from '@/domains/main/models/entities/product';

import type { IProductRepository } from '@/domains/main/application/modules/commerce/repositories/product-repository';

export class PrismaProductsRepository implements IProductRepository {
	async create(product: Product) {
		const data = ProductMapper.toPrisma(product);

		await prisma.product.create({
			data,
		});
	}

	async update(product: Product) {
		const data = ProductMapper.toPrisma(product);

		await prisma.product.update({
			data,
			where: {
				id: data.id,
			},
		});
	}

	async delete(product: Product) {
		await prisma.product.delete({
			where: {
				id: product.id.toString(),
			},
		});
	}

	async findMany(): Promise<Product[]> {
		const products = await prisma.product.findMany();

		return products.map(ProductMapper.toDomain);
	}

	async findById(id: string) {
		const product = await prisma.product.findUnique({
			where: {
				id,
			},
		});

		if (!product) {
			return null;
		}

		return ProductMapper.toDomain(product);
	}
}
