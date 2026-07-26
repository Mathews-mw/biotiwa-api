import { prisma } from '../../prisma';
import { Prisma } from '@/generated/prisma/client';
import { UserConsentMapper } from '../../mappers/user-consent-mapper';
import { UserConsent } from '@/domains/main/models/entities/user-consent';
import type {
	IFindUniqueParams,
	IUserConsentRepository,
} from '@/domains/main/application/modules/users/repositories/user-consent-repository';

export class PrismaUserConsentsRepository implements IUserConsentRepository {
	async create(userConsent: UserConsent) {
		const data = UserConsentMapper.toPrisma(userConsent) as Prisma.UserConsentUncheckedCreateInput;

		await prisma.userConsent.create({
			data,
		});
	}

	async createMany(userConsents: UserConsent[]): Promise<void> {
		const data = userConsents.map(UserConsentMapper.toPrisma);

		await prisma.userConsent.createMany({
			data,
			skipDuplicates: true,
		});
	}

	async update(userConsent: UserConsent) {
		const data = UserConsentMapper.toPrisma(userConsent);

		await prisma.userConsent.update({
			data: data as Prisma.UserConsentUncheckedUpdateInput,
			where: {
				userId_termId: {
					userId: data.userId.toString(),
					termId: data.termId.toString(),
				},
			},
		});
	}

	async delete(userConsent: UserConsent) {
		await prisma.userConsent.delete({
			where: {
				id: userConsent.id.toString(),
			},
		});
	}

	async findManyByUserId(userId: string) {
		const userConsents = await prisma.userConsent.findMany({
			where: {
				userId,
			},
		});

		return userConsents.map(UserConsentMapper.toDomain);
	}

	async findById(id: string) {
		const userConsent = await prisma.userConsent.findUnique({
			where: {
				id,
			},
		});

		if (!userConsent) {
			return null;
		}

		return UserConsentMapper.toDomain(userConsent);
	}

	async findUnique({ userId, termId }: IFindUniqueParams): Promise<UserConsent | null> {
		const userConsent = await prisma.userConsent.findUnique({
			where: {
				userId_termId: {
					userId,
					termId,
				},
			},
		});

		if (!userConsent) {
			return null;
		}

		return UserConsentMapper.toDomain(userConsent);
	}
}
