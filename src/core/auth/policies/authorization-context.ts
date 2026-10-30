import type { Actions, Entities } from '../auth-ability';
import type { IUserAuth } from '../models/user-auth-model';

export interface IAuthorizationContext {
	user: IUserAuth;
	entity: Entities;
	action: Actions;
	/**
	 * Identificador do recurso concreto.
	 *
	 * Ex.:
	 * Order.id
	 * Cart.id
	 * Affiliate.id
	 */
	resourceId?: string;
}
