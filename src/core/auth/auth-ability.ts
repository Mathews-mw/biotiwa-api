import z from 'zod';

import { IRole } from './roles';
import { IUserAuth } from './models/user-auth-model';

export const entities = z.enum(['User', 'Account']);
export type Entities = z.infer<typeof entities>;

export const actions = z.enum(['create', 'read', 'update', 'delete']);

export type Actions = z.infer<typeof actions>;

export type PermissionsMap = Record<IRole, Record<Entities, Actions[]>>;

export const rolePermissions: PermissionsMap = {
	ADMIN: {
		User: ['create', 'read', 'update', 'delete'],
		Account: ['create', 'read', 'update', 'delete'],
	},

	CUSTOMER: {
		User: ['read', 'update'],
		Account: ['read'],
	},
};

export class AuthAbility {
	static canPerformAction(user: IUserAuth, action: Actions, entity: Entities): boolean {
		const permissions = rolePermissions[user.role] || {};
		const allowedActions = permissions[entity] || [];
		return allowedActions.includes(action);
	}
}
