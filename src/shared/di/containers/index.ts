import { container } from 'tsyringe';

import { DEPENDENCY_IDENTIFIERS, DependencyIdentifiers } from './dependency-identifiers';

import { BetterAuthIdentityProvider } from '@/infra/auth/better-auth-identity-provider';

import { PaymentService } from '@/services/payments/payment-service';
import { BlingGatewayService } from '@/services/bling/bling-gateway-service';

import { PrismaUsersRepository } from '@/infra/database/repositories/users/prisma-users-repository';
import { PrismaCartsRepository } from '@/infra/database/repositories/carts/prisma-carts-repository';
import { PrismaOrderRepository } from '@/infra/database/repositories/orders/prisma-order-repository';
import { PrismaOffersRepository } from '@/infra/database/repositories/commerce/prisma-offers-repository';
import { PrismaAccountsRepository } from '@/infra/database/repositories/users/prisma-accounts-repository';
import { PrismaSessionsRepository } from '@/infra/database/repositories/users/prisma-sessions-repository';
import { PrismaMarketsRepository } from '@/infra/database/repositories/commerce/prisma-markets-repository';
import { PrismaPaymentRepository } from '@/infra/database/repositories/payments/prisma-payment-repository';
import { PrismaAddressesRepository } from '@/infra/database/repositories/users/prisma-addresses-repository';
import { PrismaProductsRepository } from '@/infra/database/repositories/commerce/prisma-products-repository';
import { PrismaOfferItemsRepository } from '@/infra/database/repositories/commerce/prisma-offer-items-repository';
import { PrismaOrderBumpsRepository } from '@/infra/database/repositories/commerce/prisma-order-bumps-repository';
import { PrismaUserConsentsRepository } from '@/infra/database/repositories/users/prisma-user-consents-repository';
import { PrismaCustomerProfilesRepository } from '@/infra/database/repositories/users/prisma-customer-profiles-repository';
import { PrismaConsentTermsRepository } from '@/infra/database/repositories/consent-terms/prisma-consent-terms-repository';
import { PrismaCommerceCatalogRepository } from '@/infra/database/repositories/commerce/prisma-commerce-catalog-repository';
import { PrismaBlingConnectionRepository } from '@/infra/database/repositories/integrations/bling/prisma-bling-connection-repository';
import { PrismaStripeWebhookEventRepository } from '@/infra/database/repositories/events/stripe/prisma-stripe-webhook-event-repository';

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
registerSingleton(DEPENDENCY_IDENTIFIERS.PRODUCTS_REPOSITORY, PrismaProductsRepository);
registerSingleton(DEPENDENCY_IDENTIFIERS.ORDER_BUMPS_REPOSITORY, PrismaOrderBumpsRepository);
registerSingleton(DEPENDENCY_IDENTIFIERS.OFFERS_REPOSITORY, PrismaOffersRepository);
registerSingleton(DEPENDENCY_IDENTIFIERS.OFFER_ITEMS_REPOSITORY, PrismaOfferItemsRepository);
registerSingleton(DEPENDENCY_IDENTIFIERS.MARKETS_REPOSITORY, PrismaMarketsRepository);
registerSingleton(DEPENDENCY_IDENTIFIERS.COMMERCE_CATALOG_REPOSITORY, PrismaCommerceCatalogRepository);
registerSingleton(DEPENDENCY_IDENTIFIERS.CARTS_REPOSITORY, PrismaCartsRepository);
registerSingleton(DEPENDENCY_IDENTIFIERS.ORDER_REPOSITORY, PrismaOrderRepository);
registerSingleton(DEPENDENCY_IDENTIFIERS.PAYMENT_REPOSITORY, PrismaPaymentRepository);
registerSingleton(DEPENDENCY_IDENTIFIERS.STRIPE_WEBHOOK_EVENT_REPOSITORY, PrismaStripeWebhookEventRepository);
registerSingleton(DEPENDENCY_IDENTIFIERS.BLING_CONNECTION_REPOSITORY, PrismaBlingConnectionRepository);

// Providers
registerSingleton(DEPENDENCY_IDENTIFIERS.IDENTITY_PROVIDER, BetterAuthIdentityProvider);

// Services
registerSingleton(DEPENDENCY_IDENTIFIERS.PAYMENT_SERVICE, PaymentService);
registerSingleton(DEPENDENCY_IDENTIFIERS.BLING_GATEWAY_SERVICE, BlingGatewayService);
