import z from 'zod';

import blingConfig from '@/config/bling-config';
import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const blingConnectionStatusSchema = z.enum(['ACTIVE', 'EXPIRED', 'REVOKED', 'ERROR']);

export type IBlingConnectionStatus = z.infer<typeof blingConnectionStatusSchema>;

export interface IBlingConnectionProps {
	status: IBlingConnectionStatus;
	accessToken: string;
	refreshToken: string;
	expiresAt: Date;
	scope?: string | null;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class BlingConnection extends Entity<IBlingConnectionProps> {
	get status() {
		return this.props.status;
	}

	set status(status: IBlingConnectionStatus) {
		this.props.status = status;
		this._touch();
	}

	get accessToken() {
		return this.props.accessToken;
	}

	set accessToken(accessToken: string) {
		this.props.accessToken = accessToken;
		this._touch();
	}

	get refreshToken() {
		return this.props.refreshToken;
	}

	set refreshToken(refreshToken: string) {
		this.props.refreshToken = refreshToken;
		this._touch();
	}

	get expiresAt() {
		return this.props.expiresAt;
	}

	set expiresAt(expiresAt: Date) {
		this.props.expiresAt = expiresAt;
		this._touch();
	}

	get scope() {
		return this.props.scope;
	}

	set scope(scope: string | null | undefined) {
		this.props.scope = scope;
		this._touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	set createdAt(createdAt: Date) {
		this.props.createdAt = createdAt;
		this._touch();
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get isActive() {
		return this.props.status === 'ACTIVE';
	}

	get isExpired() {
		return this.props.expiresAt.getTime() <= Date.now();
	}

	isExpiringSoon(safetyWindowInMs = blingConfig.BLING_TOKEN_EXPIRATION_SAFETY_WINDOW_IN_MS) {
		return this.props.expiresAt.getTime() <= Date.now() + safetyWindowInMs;
	}

	updateTokens(input: { accessToken: string; refreshToken: string; expiresAt: Date; scope?: string | null }) {
		this.props.accessToken = input.accessToken;
		this.props.refreshToken = input.refreshToken ?? this.props.refreshToken;
		this.props.expiresAt = input.expiresAt;
		this.props.scope = input.scope ?? this.props.scope;
		this.props.status = 'ACTIVE';

		this._touch();
	}

	markAsExpired() {
		this.props.status = 'EXPIRED';
		this._touch();
	}

	markAsRevoked() {
		this.props.status = 'REVOKED';
		this._touch();
	}

	markAsError() {
		this.props.status = 'ERROR';
		this._touch();
	}

	private _touch() {
		this.props.updatedAt = new Date();
	}

	static create(props: Optional<IBlingConnectionProps, 'status' | 'createdAt'>, id?: UniqueEntityId) {
		return new BlingConnection(
			{
				...props,
				status: props.status ?? 'ACTIVE',
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);
	}
}
