import z from 'zod';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const affiliateTypeSchema = z.enum(['PROMOTER', 'RESELLER']);
export type IAffiliateType = z.infer<typeof affiliateTypeSchema>;

export const affiliateStatusSchema = z.enum(['PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE']);
export type IAffiliateStatus = z.infer<typeof affiliateStatusSchema>;

interface AffiliateProps {
	userId: UniqueEntityId;
	type: IAffiliateType;
	status: IAffiliateStatus;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Affiliate extends Entity<AffiliateProps> {
	get userId() {
		return this.props.userId;
	}

	set userId(userId: UniqueEntityId) {
		this.props.userId = userId;
		this._touch();
	}

	get type() {
		return this.props.type;
	}

	set type(type: IAffiliateType) {
		this.props.type = type;
		this._touch();
	}

	get status() {
		return this.props.status;
	}

	set status(status: IAffiliateStatus) {
		this.props.status = status;
		this._touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get isActive() {
		return this.props.status === 'ACTIVE';
	}

	activate() {
		if (this.props.status === 'ACTIVE') {
			return;
		}

		this.props.status = 'ACTIVE';
		this._touch();
	}

	suspend() {
		if (this.props.status === 'SUSPENDED') {
			return;
		}

		this.props.status = 'SUSPENDED';
		this._touch();
	}

	deactivate() {
		this.props.status = 'INACTIVE';
		this._touch();
	}

	private _touch() {
		this.props.updatedAt = new Date();
	}

	static create(props: Optional<AffiliateProps, 'status' | 'createdAt' | 'updatedAt'>, id?: UniqueEntityId) {
		const now = new Date();

		return new Affiliate(
			{
				...props,
				status: props.status ?? 'PENDING',
				createdAt: props.createdAt ?? now,
				updatedAt: props.updatedAt ?? now,
			},
			id
		);
	}
}
