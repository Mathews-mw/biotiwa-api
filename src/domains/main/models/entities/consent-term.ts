import z from 'zod';

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const consentTypeSchema = z.union([
	z.literal('TERMS_OF_USE'),
	z.literal('PRIVACY_POLICY'),
	z.literal('MARKETING'),
]);

export type IConsentType = z.infer<typeof consentTypeSchema>;

export interface IConsentTermProps {
	type: IConsentType;
	version: string;
	title: string;
	description?: string | null;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class ConsentTerm extends Entity<IConsentTermProps> {
	get type() {
		return this.props.type;
	}

	set type(type: IConsentType) {
		this.props.type = type;
		this._touch();
	}

	get version() {
		return this.props.version;
	}

	set version(version: string) {
		this.props.version = version;
		this._touch();
	}

	get title() {
		return this.props.title;
	}

	set title(title: string) {
		this.props.title = title;
		this._touch();
	}

	get description() {
		return this.props.description;
	}

	set description(description: string | null | undefined) {
		this.props.description = description;
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

	static create(props: Optional<IConsentTermProps, 'createdAt'>, id?: UniqueEntityId) {
		const consentTerm = new ConsentTerm({ ...props, createdAt: props.createdAt ?? new Date() }, id);

		return consentTerm;
	}
}
