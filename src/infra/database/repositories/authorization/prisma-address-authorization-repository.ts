import { prisma } from '../../prisma';
import type { IAddressAuthorizationRepository } from '@/domains/main/application/authorization/repositories/address-authorization-repository';

export class PrismaAddressAuthorizationRepository implements IAddressAuthorizationRepository {
	async belongsToUser(input: { addressId: string; userId: string }): Promise<boolean> {
		const address = await prisma.address.findFirst({
			where: {
				id: input.addressId,
				userId: input.userId,
			},

			select: {
				id: true,
			},
		});

		return Boolean(address);
	}
}
