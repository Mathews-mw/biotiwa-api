import { prisma } from '../../prisma';
import { AccountMapper } from '../../mappers/account-mapper';
import { Account } from '@/domains/main/models/entities/account';
import type {
	IAccountRepository,
	IParams,
} from '@/domains/main/application/modules/users/repositories/account-repository';

export class PrismaAccountsRepository implements IAccountRepository {
	async create(account: Account) {
		const data = AccountMapper.toPrisma(account);

		console.log('prisma account data: ', data);

		await prisma.account.create({
			data,
		});
	}

	async update(account: Account) {
		const data = AccountMapper.toPrisma(account);

		await prisma.account.update({
			data,
			where: {
				id: data.id,
			},
		});
	}

	async delete(account: Account) {
		await prisma.account.delete({
			where: {
				id: account.id.toString(),
			},
		});
	}

	async findManyByUserId(userId: string) {
		const userAccounts = await prisma.account.findMany({
			where: {
				userId,
			},
		});

		return userAccounts.map(AccountMapper.toDomain);
	}

	async findById(id: string) {
		const account = await prisma.account.findUnique({
			where: {
				id,
			},
		});

		if (!account) {
			return null;
		}

		return AccountMapper.toDomain(account);
	}

	async findUniqueByProvider({ userId, provider }: IParams): Promise<Account | null> {
		const account = await prisma.account.findFirst({
			where: {
				userId,
				provider,
			},
		});

		if (!account) {
			return null;
		}

		return AccountMapper.toDomain(account);
	}
}
