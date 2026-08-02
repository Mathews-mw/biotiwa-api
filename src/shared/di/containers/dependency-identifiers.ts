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

	// Providers
	IDENTITY_PROVIDER: Symbol('IdentityProvider'),
} as const;

export type DependencyIdentifiers = (typeof DEPENDENCY_IDENTIFIERS)[keyof typeof DEPENDENCY_IDENTIFIERS];
