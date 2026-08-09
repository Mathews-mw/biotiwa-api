import z from 'zod';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { IMarketCode } from '@/core/types/market-code';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const cartStatusSchema = z.enum(['ACTIVE', 'CONVERTED', 'ABANDONED']);

export type ICartStatus = z.infer<typeof cartStatusSchema>;

export interface ICartProps {
	userId: UniqueEntityId;
	marketCode: IMarketCode;
	status: ICartStatus;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Cart extends Entity<ICartProps> {
	get userId() {
		return this.props.userId;
	}

	set userId(userId: UniqueEntityId) {
		this.props.userId = userId;
		this._touch();
	}

	get marketCode() {
		return this.props.marketCode;
	}

	set marketCode(marketCode: IMarketCode) {
		this.props.marketCode = marketCode;
		this._touch();
	}

	get status() {
		return this.props.status;
	}

	set status(status: ICartStatus) {
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

	static create(props: Optional<ICartProps, 'status' | 'createdAt'>, id?: UniqueEntityId) {
		const cart = new Cart(
			{
				...props,
				status: props.status ?? 'ACTIVE',
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return cart;
	}
}
