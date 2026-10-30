export abstract class IAddressAuthorizationRepository {
	abstract belongsToUser(input: { addressId: string; userId: string }): Promise<boolean>;
}
