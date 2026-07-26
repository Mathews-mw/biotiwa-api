import { inject, injectable } from 'tsyringe';

import type { IUserRepository } from '../repositories/user-repository';
import type { IConsentType } from '@/domains/main/models/entities/consent-term';
import type { IUserConsentRepository } from '../repositories/user-consent-repository';
import type { IConsentTermRepository } from '../../consent-terms/repositories/consent-term-repository';

import { failure, Outcome, success } from '@/core/outcome';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { UserConsent } from '@/domains/main/models/entities/user-consent';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	userEmail: string;
	consents: Array<{
		type: IConsentType;
		version: string;
		acceptedAt?: Date;
	}>;
	ipAddress?: string | null;
	userAgent?: string | null;
}

type Response = Outcome<ResourceNotFoundError | BadRequestError, null>;

@injectable()
export class AcceptConsentTermsUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.USER_CONSENTS_REPOSITORY)
		private usersRepository: IUserRepository,
		@inject(DEPENDENCY_IDENTIFIERS.CONSENT_TERMS_REPOSITORY)
		private consentTermsRepository: IConsentTermRepository,
		@inject(DEPENDENCY_IDENTIFIERS.USER_CONSENTS_REPOSITORY)
		private userConsentsRepository: IUserConsentRepository
	) {}

	async execute({ userEmail, consents, ipAddress, userAgent }: IRequest): Promise<Response> {
		const user = await this.usersRepository.findUnique({ email: userEmail });

		if (!user) {
			return failure(new ResourceNotFoundError('User not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		const userConsentsToCreate: Array<UserConsent> = [];

		for await (const consent of consents) {
			const term = await this.consentTermsRepository.findUnique({ type: consent.type, version: consent.version });

			if (!term) {
				continue;
			}

			const alreadyAccepted = await this.userConsentsRepository.findUnique({
				userId: user.id.toString(),
				termId: term.id.toString(),
			});

			if (alreadyAccepted) {
				continue;
			}

			const newUserConsent = UserConsent.create({
				userId: user.id,
				termId: term.id,
				acceptedAt: consent.acceptedAt ?? new Date(),
				ipAddress,
				userAgent,
			});

			userConsentsToCreate.push(newUserConsent);
		}

		if (userConsentsToCreate.length > 0) {
			await this.userConsentsRepository.createMany(userConsentsToCreate);
		}

		return success(null);
	}
}
