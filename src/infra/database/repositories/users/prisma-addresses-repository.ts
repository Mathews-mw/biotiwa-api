import { prisma } from '../../prisma';
import { AddressMapper } from '../../mappers/address-mapper';
import { Address } from '@/domains/main/models/entities/address';
import type {
	IParams,
	IAddressRepository,
} from '@/domains/main/application/modules/users/repositories/address-repository';

export class PrismaAddressesRepository implements IAddressRepository {
	async create(address: Address) {
		const data = AddressMapper.toPrisma(address);

		await prisma.$transaction(async (tx) => {
			if (data.isDefault) {
				await tx.address.updateMany({
					data: {
						isDefault: false,
					},
					where: {
						userId: address.userId.toString(),
						isDefault: true,
					},
				});
			}

			await tx.address.create({
				data,
			});
		});
	}

	async update(address: Address) {
		const data = AddressMapper.toPrisma(address);

		await prisma.address.update({
			data,
			where: {
				id: data.id,
			},
		});
	}

	async delete(address: Address) {
		await prisma.address.delete({
			where: {
				id: address.id.toString(),
			},
		});
	}

	async setAsDefault(address: Address) {
		await prisma.$transaction(async (tx) => {
			await tx.address.updateMany({
				data: {
					isDefault: false,
				},
				where: {
					isDefault: true,
					userId: address.userId.toString(),
				},
			});

			await tx.address.update({
				data: {
					isDefault: true,
				},
				where: {
					id: address.id.toString(),
					userId: address.userId.toString(),
				},
			});
		});
	}

	async findById(id: string) {
		const address = await prisma.address.findUnique({
			where: {
				id,
			},
		});

		if (!address) {
			return null;
		}

		return AddressMapper.toDomain(address);
	}

	async findManyByUserId({ userId, isDefault }: IParams) {
		const addresses = await prisma.address.findMany({
			where: {
				userId,
				isDefault,
			},
		});

		return addresses.map(AddressMapper.toDomain);
	}
}
