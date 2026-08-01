import { inject, injectable } from 'tsyringe';

import type { IUserRepository } from '../repositories/user-repository';
import type { IIdentityProvider } from '../../../ports/identity-provider';
import type { IConsentType } from '@/domains/main/models/entities/consent-term';
import type { IUserConsentRepository } from '../repositories/user-consent-repository';
import type { ICustomerProfileRepository } from '../repositories/customer-profile-repository';
import type { IConsentTermRepository } from '../../consent-terms/repositories/consent-term-repository';

import { failure, Outcome, success } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { UserConsent } from '@/domains/main/models/entities/user-consent';
import { CustomerProfile } from '@/domains/main/models/entities/customer-profile';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	name: string;
	email: string;
	password: string;
	image?: string;
	userConsent: {
		consents: Array<{
			type: IConsentType;
			version: string;
			acceptedAt?: Date;
		}>;
		ipAddress?: string | null;
		userAgent?: string | null;
	};
	context: {
		headers: Record<string, string | string[] | undefined>;
		ip?: string;
		userAgent?: string;
	};
}

type Response = Outcome<
	BadRequestError,
	{
		user: {
			id: string;
			name: string;
			email: string;
		};
		responseHeaders: Array<{
			name: string;
			value: string;
		}>;
	}
>;

@injectable()
export class CreateUserUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository,
		@inject(DEPENDENCY_IDENTIFIERS.IDENTITY_PROVIDER) private identityProvider: IIdentityProvider,
		@inject(DEPENDENCY_IDENTIFIERS.USER_CONSENTS_REPOSITORY) private userConsentsRepository: IUserConsentRepository,
		@inject(DEPENDENCY_IDENTIFIERS.CUSTOMER_PROFILES_REPOSITORY)
		private customerProfilesRepository: ICustomerProfileRepository,
		@inject(DEPENDENCY_IDENTIFIERS.CONSENT_TERMS_REPOSITORY)
		private consentTermsRepository: IConsentTermRepository
	) {}

	async execute({ name, email, image, password, userConsent, context }: IRequest): Promise<Response> {
		const acceptTerms = userConsent.consents.find((term) => term.type === 'TERMS_OF_USE');
		const acceptPrivacyPolicy = userConsent.consents.find((term) => term.type === 'PRIVACY_POLICY');

		if (!acceptTerms) {
			return failure(new BadRequestError('Terms of use must be accepted', 'TERMS_NOT_ACCEPTED'));
		}

		if (!acceptPrivacyPolicy) {
			return failure(new BadRequestError('Privacy policy must be accepted', 'PRIVACY_POLICY_NOT_ACCEPTED'));
		}

		const userWithSameEmail = await this.usersRepository.findByEmail(email);

		if (userWithSameEmail) {
			return failure(new BadRequestError('User with same e-mail already exists', 'SAME_EMAIL_ERROR'));
		}

		const registeredIdentity = await this.identityProvider.registerWithEmailAndPassword({
			context,
			name,
			email,
			password,
			image,
		});

		const userConsentsToCreate: Array<UserConsent> = [];

		for await (const consent of userConsent.consents) {
			const term = await this.consentTermsRepository.findUnique({ type: consent.type, version: consent.version });

			if (!term) {
				continue;
			}

			const newUserConsent = UserConsent.create({
				userId: new UniqueEntityId(registeredIdentity.user.id),
				termId: term.id,
				acceptedAt: consent.acceptedAt ?? new Date(),
				ipAddress: userConsent.ipAddress,
				userAgent: userConsent.userAgent,
			});

			userConsentsToCreate.push(newUserConsent);
		}

		if (userConsentsToCreate.length > 0) {
			await this.userConsentsRepository.createMany(userConsentsToCreate);
		}

		const newProfile = CustomerProfile.create({
			userId: new UniqueEntityId(registeredIdentity.user.id),
		});

		await this.customerProfilesRepository.create(newProfile);

		return success({ user: registeredIdentity.user, responseHeaders: registeredIdentity.responseHeaders });
	}
}
