export abstract class ICartAuthorizationRepository {
	abstract belongsToUser(input: { cartId: string; userId: string }): Promise<boolean>;
}
