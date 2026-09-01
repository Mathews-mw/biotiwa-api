export const DEPENDENCY_IDENTIFIERS = {
	// Repositories
	ACCOUNTS_REPOSITORY: Symbol('AccountsRepository'),
	ADDRESSES_REPOSITORY: Symbol('AddressesRepository'),
	CONSENT_TERMS_REPOSITORY: Symbol('ConsentTermsRepository'),
	CUSTOMER_PROFILES_REPOSITORY: Symbol('CustomerProfilesRepository'),
	SESSIONS_REPOSITORY: Symbol('SessionsRepository'),
	USER_CONSENTS_REPOSITORY: Symbol('UserConsentsRepository'),
	USERS_REPOSITORY: Symbol('UsersRepository'),
	PRODUCTS_REPOSITORY: Symbol('ProductsRepository'),
	ORDER_BUMPS_REPOSITORY: Symbol('ProductsRepository'),
	OFFERS_REPOSITORY: Symbol('ProductsRepository'),
	OFFER_ITEMS_REPOSITORY: Symbol('ProductsRepository'),
	MARKETS_REPOSITORY: Symbol('ProductsRepository'),
	COMMERCE_CATALOG_REPOSITORY: Symbol('CommerceCatalogRepository'),
	CARTS_REPOSITORY: Symbol('CartsRepository'),
	ORDER_REPOSITORY: Symbol('OrderRepository'),
	PAYMENT_REPOSITORY: Symbol('PaymentRepository'),
	STRIPE_WEBHOOK_EVENT_REPOSITORY: Symbol('StripeWebhookEventRepository'),
	BLING_CONNECTION_REPOSITORY: Symbol('PrismaBlingConnectionRepository'),

	// Providers
	IDENTITY_PROVIDER: Symbol('IdentityProvider'),

	// Services
	PAYMENT_SERVICE: Symbol('PaymentService'),
	BLING_GATEWAY_SERVICE: Symbol('BlingGatewayService'),
	BLING_AUTHENTICATION: Symbol('BlingAuthenticationService'),
} as const;

export type DependencyIdentifiers = (typeof DEPENDENCY_IDENTIFIERS)[keyof typeof DEPENDENCY_IDENTIFIERS];
