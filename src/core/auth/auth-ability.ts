import z from 'zod';

import type { IRole } from './roles';
import type { IUserAuth } from './models/user-auth-model';

export const entities = z.enum([
	'Account',
	'Address',
	'Affiliate',
	'AffiliateCommission',
	'AffiliateProgramSettings',
	'AffiliatePromotionCode',
	'BlingConnection',
	'BlingOrderSync',
	'Cart',
	'CartItem',
	'ConsentTerm',
	'CustomerProfile',
	'Market',
	'MelhorEnvioConnection',
	'MelhorEnvioOAuthState',
	'Offer',
	'OfferItem',
	'Order',
	'OrderBump',
	'OrderCustomer',
	'OrderItem',
	'OrderPromotion',
	'OrderShippingAddress',
	'OrderShippingRate',
	'Payment',
	'Product',
	'ProductShippingProfile',
	'PromotionCode',
	'PromotionRedemption',
	'Session',
	'ShippingQuote',
	'ShippingQuoteRate',
	'StripeWebhookEvent',
	'User',
	'UserConsent',
	'Verification',
]);

export type Entities = z.infer<typeof entities>;

export const actions = z.enum(['create', 'read', 'update', 'delete', 'approve', 'suspend', 'refund', 'release']);

export type Actions = z.infer<typeof actions>;

export type PermissionsMap = Record<IRole, Record<Entities, readonly Actions[]>>;

export const rolePermissions = {
	ADMIN: {
		Account: ['create', 'read', 'update', 'delete'],
		Address: ['create', 'read', 'update', 'delete'],
		Affiliate: ['create', 'read', 'update', 'delete'],
		AffiliateCommission: ['create', 'read', 'update', 'delete'],
		AffiliateProgramSettings: ['create', 'read', 'update', 'delete'],
		AffiliatePromotionCode: ['create', 'read', 'update', 'delete'],
		BlingConnection: ['create', 'read', 'update', 'delete'],
		BlingOrderSync: ['create', 'read', 'update', 'delete'],
		Cart: ['create', 'read', 'update', 'delete'],
		CartItem: ['create', 'read', 'update', 'delete'],
		ConsentTerm: ['create', 'read', 'update', 'delete'],
		CustomerProfile: ['create', 'read', 'update', 'delete'],
		Market: ['create', 'read', 'update', 'delete'],
		MelhorEnvioConnection: ['create', 'read', 'update', 'delete'],
		MelhorEnvioOAuthState: ['create', 'read', 'update', 'delete'],
		Offer: ['create', 'read', 'update', 'delete'],
		OfferItem: ['create', 'read', 'update', 'delete'],
		Order: ['create', 'read', 'update', 'delete'],
		OrderBump: ['create', 'read', 'update', 'delete'],
		OrderCustomer: ['create', 'read', 'update', 'delete'],
		OrderItem: ['create', 'read', 'update', 'delete'],
		OrderPromotion: ['create', 'read', 'update', 'delete'],
		OrderShippingAddress: ['create', 'read', 'update', 'delete'],
		OrderShippingRate: ['create', 'read', 'update', 'delete'],
		Payment: ['create', 'read', 'update', 'delete'],
		Product: ['create', 'read', 'update', 'delete'],
		ProductShippingProfile: ['create', 'read', 'update', 'delete'],
		PromotionCode: ['create', 'read', 'update', 'delete'],
		PromotionRedemption: ['create', 'read', 'update', 'delete'],
		Session: ['create', 'read', 'update', 'delete'],
		ShippingQuote: ['create', 'read', 'update', 'delete'],
		ShippingQuoteRate: ['create', 'read', 'update', 'delete'],
		StripeWebhookEvent: ['create', 'read', 'update', 'delete'],
		User: ['create', 'read', 'update', 'delete'],
		UserConsent: ['create', 'read', 'update', 'delete'],
		Verification: ['create', 'read', 'update', 'delete'],
	},
	CUSTOMER: {
		Account: ['read'],
		Address: ['create', 'read', 'update', 'delete'],
		Affiliate: ['create', 'read'],
		AffiliateCommission: ['create', 'read'],
		AffiliateProgramSettings: ['read'],
		AffiliatePromotionCode: ['create', 'read'],
		BlingConnection: [],
		BlingOrderSync: [],
		Cart: ['create', 'read', 'update'],
		CartItem: ['create', 'read', 'update', 'delete'],
		ConsentTerm: ['create', 'read', 'update'],
		CustomerProfile: ['read'],
		Market: ['read'],
		MelhorEnvioConnection: [],
		MelhorEnvioOAuthState: [],
		Offer: ['read'],
		OfferItem: ['read'],
		Order: ['read'],
		OrderBump: ['read'],
		OrderCustomer: ['read'],
		OrderItem: ['read'],
		OrderPromotion: ['read'],
		OrderShippingAddress: ['read'],
		OrderShippingRate: ['read'],
		Payment: ['read'],
		Product: ['read'],
		ProductShippingProfile: ['read'],
		PromotionCode: ['read'],
		PromotionRedemption: [],
		Session: ['read', 'update'],
		ShippingQuote: ['read'],
		ShippingQuoteRate: ['read'],
		StripeWebhookEvent: [],
		User: ['read', 'update'],
		UserConsent: ['read', 'update'],
		Verification: [],
	},
} as const satisfies PermissionsMap;

export class AuthAbility {
	static canPerformAction(user: IUserAuth, action: Actions, entity: Entities): boolean {
		const permissions = rolePermissions[user.role] || {};
		const allowedActions = permissions[entity] || [];
		return (allowedActions as readonly Actions[]).includes(action);
	}
}
