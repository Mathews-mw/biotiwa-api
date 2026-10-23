import z from 'zod';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const affiliateTypeSchema = z.enum(['PROMOTER', 'RESELLER']);
export type IAffiliateType = z.infer<typeof affiliateTypeSchema>;

export const affiliateStatusSchema = z.enum(['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECT', 'INACTIVE']);
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

	get isPending() {
		return this.props.status === 'PENDING';
	}

	activate() {
		if (this.props.status === 'ACTIVE') {
			return;
		}

		this.props.status = 'ACTIVE';
		this._touch();
	}

	approve() {
		if (this.props.status !== 'PENDING') {
			throw new Error('Only pending affiliates can be approved.');
		}

		this.props.status = 'ACTIVE';

		this._touch();
	}

	reject() {
		if (this.props.status !== 'PENDING') {
			throw new Error('Only pending affiliates can be rejected.');
		}

		this.props.status = 'REJECT';

		this._touch();
	}

	suspend() {
		if (this.props.status !== 'ACTIVE') {
			return;
		}

		this.props.status = 'SUSPENDED';

		this._touch();
	}

	deactivate() {
		this.props.status = 'INACTIVE';
		this._touch();
	}

	reactivate() {
		if (this.props.status !== 'SUSPENDED' && this.props.status !== 'INACTIVE') {
			return;
		}

		this.props.status = 'ACTIVE';

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
