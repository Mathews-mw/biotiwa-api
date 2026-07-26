import { prisma } from '../../prisma';
import { CustomerProfileMapper } from '../../mappers/customer-profile-mapper';
import { CustomerProfile } from '@/domains/main/models/entities/customer-profile';
import type { ICustomerProfileRepository } from '@/domains/main/application/modules/users/repositories/customer-profile-repository';

export class PrismaCustomerProfilesRepository implements ICustomerProfileRepository {
	async create(customerProfile: CustomerProfile) {
		const data = CustomerProfileMapper.toPrisma(customerProfile);

		await prisma.customerProfile.create({
			data,
		});
	}

	async update(customerProfile: CustomerProfile) {
		const data = CustomerProfileMapper.toPrisma(customerProfile);

		await prisma.customerProfile.update({
			data,
			where: {
				id: data.id,
			},
		});
	}

	async delete(customerProfile: CustomerProfile) {
		await prisma.customerProfile.delete({
			where: {
				id: customerProfile.id.toString(),
			},
		});
	}

	async findById(id: string) {
		const customerProfile = await prisma.customerProfile.findUnique({
			where: {
				id,
			},
		});

		if (!customerProfile) {
			return null;
		}

		return CustomerProfileMapper.toDomain(customerProfile);
	}

	async findByUserId(userId: string) {
		const customerProfile = await prisma.customerProfile.findUnique({
			where: {
				userId,
			},
		});

		if (!customerProfile) {
			return null;
		}

		return CustomerProfileMapper.toDomain(customerProfile);
	}
}
