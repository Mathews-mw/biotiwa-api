import { container } from 'tsyringe';

import { DEPENDENCY_IDENTIFIERS, DependencyIdentifiers } from './dependency-identifiers';

import { BetterAuthIdentityProvider } from '@/infra/auth/better-auth-identity-provider';

import { PrismaUsersRepository } from '@/infra/database/repositories/users/prisma-users-repository';
import { PrismaAccountsRepository } from '@/infra/database/repositories/users/prisma-accounts-repository';
import { PrismaSessionsRepository } from '@/infra/database/repositories/users/prisma-sessions-repository';
import { PrismaAddressesRepository } from '@/infra/database/repositories/users/prisma-addresses-repository';
import { PrismaUserConsentsRepository } from '@/infra/database/repositories/users/prisma-user-consents-repository';
import { PrismaCustomerProfilesRepository } from '@/infra/database/repositories/users/prisma-customer-profiles-repository';
import { PrismaConsentTermsRepository } from '@/infra/database/repositories/consent-terms/prisma-consent-terms-repository';

function registerSingleton<T>(identifier: DependencyIdentifiers, implementation: new (...args: unknown[]) => T) {
	container.registerSingleton(identifier, implementation);
}

// Repositories
registerSingleton(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY, PrismaUsersRepository);
registerSingleton(DEPENDENCY_IDENTIFIERS.ACCOUNTS_REPOSITORY, PrismaAccountsRepository);
registerSingleton(DEPENDENCY_IDENTIFIERS.SESSIONS_REPOSITORY, PrismaSessionsRepository);
registerSingleton(DEPENDENCY_IDENTIFIERS.ADDRESSES_REPOSITORY, PrismaAddressesRepository);
registerSingleton(DEPENDENCY_IDENTIFIERS.CONSENT_TERMS_REPOSITORY, PrismaConsentTermsRepository);
registerSingleton(DEPENDENCY_IDENTIFIERS.USER_CONSENTS_REPOSITORY, PrismaUserConsentsRepository);
registerSingleton(DEPENDENCY_IDENTIFIERS.CUSTOMER_PROFILES_REPOSITORY, PrismaCustomerProfilesRepository);

// Providers
registerSingleton(DEPENDENCY_IDENTIFIERS.IDENTITY_PROVIDER, BetterAuthIdentityProvider);
