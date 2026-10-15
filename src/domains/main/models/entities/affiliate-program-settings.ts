import type { IMarketCode } from '@/core/types/market-code';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface AffiliateProgramSettingsProps {
	marketCode: IMarketCode;
	minCodeLifetimeDays: number;
	maxCodeLifetimeDays: number;
	attributionWindowDays: number;
	isActive: boolean;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class AffiliateProgramSettings extends Entity<AffiliateProgramSettingsProps> {
	get marketCode() {
		return this.props.marketCode;
	}

	set marketCode(marketCode: IMarketCode) {
		this.props.marketCode = marketCode;
		this._touch();
	}

	get minCodeLifetimeDays() {
		return this.props.minCodeLifetimeDays;
	}

	set minCodeLifetimeDays(minCodeLifetimeDays: number) {
		this.props.minCodeLifetimeDays = minCodeLifetimeDays;
		this._touch();
	}

	get maxCodeLifetimeDays() {
		return this.props.maxCodeLifetimeDays;
	}

	set maxCodeLifetimeDays(maxCodeLifetimeDays: number) {
		this.props.maxCodeLifetimeDays = maxCodeLifetimeDays;
		this._touch();
	}

	get attributionWindowDays() {
		return this.props.attributionWindowDays;
	}

	set attributionWindowDays(attributionWindowDays: number) {
		this.props.attributionWindowDays = attributionWindowDays;
		this._touch();
	}

	get isActive() {
		return this.props.isActive;
	}

	set isActive(isActive: boolean) {
		this.props.isActive = isActive;
		this._touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	activate() {
		if (this.props.isActive) {
			return;
		}

		this.props.isActive = true;
		this._touch();
	}

	deactivate() {
		if (!this.props.isActive) {
			return;
		}

		this.props.isActive = false;
		this._touch();
	}

	updateCodeLifetimeRange(minCodeLifetimeDays: number, maxCodeLifetimeDays: number) {
		AffiliateProgramSettings._validateCodeLifetimeRange(minCodeLifetimeDays, maxCodeLifetimeDays);

		this.props.minCodeLifetimeDays = minCodeLifetimeDays;

		this.props.maxCodeLifetimeDays = maxCodeLifetimeDays;

		this._touch();
	}

	updateAttributionWindow(attributionWindowDays: number) {
		if (!Number.isInteger(attributionWindowDays) || attributionWindowDays <= 0) {
			throw new Error('Attribution window must be a positive integer.');
		}

		this.props.attributionWindowDays = attributionWindowDays;

		this._touch();
	}

	private _touch() {
		this.props.updatedAt = new Date();
	}

	private static _validateCodeLifetimeRange(minCodeLifetimeDays: number, maxCodeLifetimeDays: number) {
		if (!Number.isInteger(minCodeLifetimeDays) || minCodeLifetimeDays <= 0) {
			throw new Error('Minimum code lifetime must be a positive integer.');
		}

		if (!Number.isInteger(maxCodeLifetimeDays) || maxCodeLifetimeDays <= 0) {
			throw new Error('Maximum code lifetime must be a positive integer.');
		}

		if (minCodeLifetimeDays > maxCodeLifetimeDays) {
			throw new Error('Minimum code lifetime cannot exceed maximum code lifetime.');
		}
	}

	static create(
		props: Optional<AffiliateProgramSettingsProps, 'isActive' | 'attributionWindowDays' | 'createdAt' | 'updatedAt'>,
		id?: UniqueEntityId
	) {
		AffiliateProgramSettings._validateCodeLifetimeRange(props.minCodeLifetimeDays, props.maxCodeLifetimeDays);

		const attributionWindowDays = props.attributionWindowDays ?? 30;

		if (!Number.isInteger(attributionWindowDays) || attributionWindowDays <= 0) {
			throw new Error('Attribution window must be a positive integer.');
		}

		const now = new Date();

		return new AffiliateProgramSettings(
			{
				...props,
				isActive: props.isActive ?? true,
				attributionWindowDays,
				createdAt: props.createdAt ?? now,
				updatedAt: props.updatedAt ?? now,
			},
			id
		);
	}
}
