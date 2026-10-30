import type { IAuthorizationContext } from './authorization-context';

export abstract class IAuthorizationPolicy {
	/**
	 * Define se esta policy deve
	 * participar da autorização.
	 */
	abstract supports(context: IAuthorizationContext): boolean;

	/**
	 * Valida a autorização.
	 *
	 * Deve lançar `ForbiddenError`
	 * quando o acesso não for permitido.
	 */
	abstract authorize(context: IAuthorizationContext): Promise<void>;
}
