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
	BLING_CONNECTION_REPOSITORY: Symbol('BlingConnectionRepository'),
	BLING_ORDER_SYNC_REPOSITORY: Symbol('BlingOrderSyncRepository'),
	MELHOR_ENVIO_CONNECTION_REPOSITORY: Symbol('MelhorEnvioConnectionRepository'),
	MELHOR_ENVIO_OAUTH_STATE_REPOSITORY: Symbol('MelhorEnvioOAuthStateRepository'),
	SHIPPING_QUOTE_REPOSITORY: Symbol('ShippingQuoteRepository'),
	PROMOTION_CODES_REPOSITORY: Symbol('PromotionCodesRepository'),
	PROMOTION_REDEMPTION_REPOSITORY: Symbol('PromotionRedemptionRepository'),
	AFFILIATES_REPOSITORY: Symbol('PrismaAffiliateRepository'),
	AFFILIATE_PROMOTION_CODES_REPOSITORY: Symbol('PrismaAffiliatePromotionCodesRepository'),
	AFFILIATE_PROGRAM_SETTINGS_REPOSITORY: Symbol('PrismaAffiliateProgramSettingsRepository'),
	AFFILIATE_COMMISSION_REPOSITORY: Symbol('AffiliateCommissionRepository'),
	AFFILIATE_DASHBOARD_REPOSITORY: Symbol('AffiliateDashboardRepository'),
	AFFILIATE_SALES_REPOSITORY: Symbol('AffiliateSalesRepository'),

	// Providers
	IDENTITY_PROVIDER: Symbol('IdentityProvider'),

	// Services
	PAYMENT_SERVICE: Symbol('PaymentService'),
	BLING_GATEWAY_SERVICE: Symbol('BlingGatewayService'),
	BLING_AUTHENTICATION: Symbol.for('BlingAuthenticationService'),
	MELHOR_ENVIO_AUTHENTICATION: Symbol.for('MelhorEnvioAuthenticationService'),
	SHIPPING_SERVICE: Symbol.for('ShippingService'),
	SHIPPING_RATE_RESOLVER: Symbol.for('ShippingRateResolver'),
	PROMOTION_CODE_RESOLVER: Symbol.for('PromotionCodeResolver'),
	PROMOTION_RESOLVER_SERVICE: Symbol.for('PromotionResolverService'),
	PROMOTION_REDEMPTION_LIFECYCLE_SERVICE: Symbol.for('PromotionRedemptionLifecycleService'),
	AFFILIATE_PROMOTION_VALIDATOR: Symbol.for('AffiliatePromotionValidator'),

	// use cases
	ENQUEUE_BLING_ORDER_SYNC_USE_CASE: Symbol.for('EnqueueBlingOrderSyncUseCase'),
	PROCESS_NEXT_BLING_ORDER_SYNC_USE_CASE: Symbol.for('ProcessNextBlingOrderSyncUseCase'),
	PROCESS_BLING_ORDER_SYNC_BATCH_USE_CASE: Symbol.for('ProcessBlingOrderSyncBatchUseCase'),
	GET_VALID_MELHOR_ENVIO_ACCESS_TOKEN_USE_CASE: Symbol.for('GetValidMelhorEnvioAccessTokenUseCase'),
	RESOLVE_SHIPPING_RATE_FOR_CHECKOUT_USE_CASE: Symbol.for('ResolveShippingRateForCheckoutUseCase'),
	CREATE_AFFILIATE_COMMISSION_FOR_ORDER_USE_CASE: Symbol.for('CreateAffiliateCommissionForOrderUseCase'),
	CANCEL_AFFILIATE_COMMISSION_BY_ORDER_USE_CASE: Symbol.for('CancelAffiliateCommissionByOrderUseCase'),

	// Policies
	AUTHORIZATION_POLICY: Symbol('AUTHORIZATION_POLICY'),
	AUTHORIZATION_SERVICE: Symbol('AUTHORIZATION_SERVICE'),
	ORDER_AUTHORIZATION_REPOSITORY: Symbol('ORDER_AUTHORIZATION_REPOSITORY'),
	CART_AUTHORIZATION_REPOSITORY: Symbol('CartAuthorizationRepository'),
	ADDRESS_AUTHORIZATION_REPOSITORY: Symbol('AddressAuthorizationRepository'),
} as const;

export type DependencyIdentifiers = (typeof DEPENDENCY_IDENTIFIERS)[keyof typeof DEPENDENCY_IDENTIFIERS];
