export abstract class IOrderAuthorizationRepository {
	abstract belongsToUser(input: { orderId: string; userId: string }): Promise<boolean>;
}
