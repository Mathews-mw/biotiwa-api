import type { IProductProps, Product } from '../entities/product';

import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { IProductShippingProfileProps } from '../entities/product-shipping-profile';

export interface IProductDetailsProps extends IProductProps {
	product: Product;
	id: UniqueEntityId;
	productShippingProfile?: IProductShippingProfileProps | null;
}

export class ProductDetails extends ValueObject<IProductDetailsProps> {
	get product() {
		return this.props.product;
	}

	get sku() {
		return this.props.sku;
	}

	get slug() {
		return this.props.slug;
	}

	get name() {
		return this.props.name;
	}

	get shortDescription() {
		return this.props.shortDescription;
	}

	get description() {
		return this.props.description;
	}

	get imageUrl() {
		return this.props.imageUrl;
	}

	get pillsPerPack() {
		return this.props.pillsPerPack;
	}

	get status() {
		return this.props.status;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get productShippingProfile() {
		return this.props.productShippingProfile;
	}

	static create(props: IProductDetailsProps) {
		const productDetails = new ProductDetails(props);

		return productDetails;
	}
}
