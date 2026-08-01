import z from 'zod';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const productStatusSchema = z.enum(['DRAFT', 'ARCHIVED', 'ACTIVE']);

export type IProductStatus = z.infer<typeof productStatusSchema>;

export interface IProductProps {
	sku: string;
	slug: string;
	name: string;
	shortDescription: string;
	description?: string | null;
	imageUrl?: string | null;
	pillsPerPack?: number | null;
	status: IProductStatus;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Product extends Entity<IProductProps> {
	get sku() {
		return this.props.sku;
	}

	set sku(sku: string) {
		this.props.sku = sku;
		this._touch();
	}

	get slug() {
		return this.props.slug;
	}

	set slug(slug: string) {
		this.props.slug = slug;
		this._touch();
	}

	get name() {
		return this.props.name;
	}

	set name(name: string) {
		this.props.name = name;
		this._touch();
	}

	get shortDescription() {
		return this.props.shortDescription;
	}

	set shortDescription(shortDescription: string) {
		this.props.shortDescription = shortDescription;
		this._touch();
	}

	get description() {
		return this.props.description;
	}

	set description(description: string | undefined | null) {
		this.props.description = description;
		this._touch();
	}

	get imageUrl() {
		return this.props.imageUrl;
	}

	set imageUrl(imageUrl: string | undefined | null) {
		this.props.imageUrl = imageUrl;
		this._touch();
	}

	get pillsPerPack() {
		return this.props.pillsPerPack;
	}

	set pillsPerPack(pillsPerPack: number | undefined | null) {
		this.props.pillsPerPack = pillsPerPack;
		this._touch();
	}

	get status() {
		return this.props.status;
	}

	set status(status: IProductStatus) {
		this.props.status = status;
		this._touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	private _touch() {
		this.props.updatedAt = new Date();
	}

	static create(props: Optional<IProductProps, 'status' | 'createdAt'>, id?: UniqueEntityId) {
		const product = new Product(
			{
				...props,
				status: props.status ?? 'DRAFT',
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return product;
	}
}
