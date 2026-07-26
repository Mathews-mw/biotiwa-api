import z from 'zod';

import { Entity } from '@/core/entities/entity.js';
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js';
import { Optional } from '@/core/types/optional.js';

export const accountProviderSchema = z.union([z.literal('CREDENTIALS'), z.literal('GOOGLE')]);

export type IAccountProvider = z.infer<typeof accountProviderSchema>;

export interface IAccountProps {
	userId: UniqueEntityId;
	accountId: string;
	providerId: string;
	provider: IAccountProvider;
	accessToken?: string | null;
	refreshToken?: string | null;
	accessTokenExpiresAt?: Date | null;
	refreshTokenExpiresAt?: Date | null;
	scope?: string | null;
	idToken?: string | null;
	password?: string | null;
	isActive: boolean;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Account extends Entity<IAccountProps> {
	get userId() {
		return this.props.userId;
	}

	set userId(userId: UniqueEntityId) {
		this.props.userId = userId;
		this._touch();
	}

	get accountId() {
		return this.props.accountId;
	}

	set accountId(accountId: string) {
		this.props.accountId = accountId;
		this._touch();
	}

	get providerId() {
		return this.props.providerId;
	}

	set providerId(providerId: string) {
		this.props.providerId = providerId;
		this._touch();
	}

	get provider() {
		return this.props.provider;
	}

	set provider(provider: IAccountProvider) {
		this.props.provider = provider;
		this._touch();
	}

	get accessToken() {
		return this.props.accessToken;
	}

	set accessToken(accessToken: string | null | undefined) {
		this.props.accessToken = accessToken;
		this._touch();
	}

	get refreshToken() {
		return this.props.refreshToken;
	}

	set refreshToken(refreshToken: string | null | undefined) {
		this.props.refreshToken = refreshToken;
		this._touch();
	}

	get accessTokenExpiresAt() {
		return this.props.accessTokenExpiresAt;
	}

	set accessTokenExpiresAt(accessTokenExpiresAt: Date | null | undefined) {
		this.props.accessTokenExpiresAt = accessTokenExpiresAt;
		this._touch();
	}

	get refreshTokenExpiresAt() {
		return this.props.refreshTokenExpiresAt;
	}

	set refreshTokenExpiresAt(refreshTokenExpiresAt: Date | null | undefined) {
		this.props.refreshTokenExpiresAt = refreshTokenExpiresAt;
		this._touch();
	}

	get scope() {
		return this.props.scope;
	}

	set scope(scope: string | null | undefined) {
		this.props.scope = scope;
		this._touch();
	}

	get idToken() {
		return this.props.idToken;
	}

	set idToken(idToken: string | null | undefined) {
		this.props.idToken = idToken;
		this._touch();
	}

	get password() {
		return this.props.password;
	}

	set password(password: string | null | undefined) {
		this.props.password = password;
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

	private _touch() {
		this.props.updatedAt = new Date();
	}

	static create(
		props: Optional<IAccountProps, 'createdAt' | 'isActive' | 'accountId' | 'providerId'>,
		id?: UniqueEntityId
	) {
		const account = new Account(
			{
				...props,
				isActive: props.isActive ?? true,
				accountId: props.accountId ?? props.userId.toString(),
				providerId:
					props.providerId ?? (props.provider === 'CREDENTIALS' ? props.userId.toString() : props.providerId!),
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return account;
	}
}
