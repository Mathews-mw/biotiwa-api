import { prisma } from '../../prisma';
import { ConsentTermMapper } from '../../mappers/consent-term-mapper';
import { ConsentTerm } from '@/domains/main/models/entities/consent-term';
import type {
	IConsentTermRepository,
	IParams,
} from '@/domains/main/application/modules/consent-terms/repositories/consent-term-repository';

export class PrismaConsentTermsRepository implements IConsentTermRepository {
	async create(consentTerm: ConsentTerm) {
		const data = ConsentTermMapper.toPrisma(consentTerm);

		await prisma.consentTerm.create({
			data,
		});
	}

	async update(consentTerm: ConsentTerm) {
		const data = ConsentTermMapper.toPrisma(consentTerm);

		await prisma.consentTerm.update({
			data,
			where: {
				id: data.id,
			},
		});
	}

	async delete(consentTerm: ConsentTerm) {
		await prisma.consentTerm.delete({
			where: {
				id: consentTerm.id.toString(),
			},
		});
	}

	async findById(id: string) {
		const consentTerm = await prisma.consentTerm.findUnique({
			where: {
				id,
			},
		});

		if (!consentTerm) {
			return null;
		}

		return ConsentTermMapper.toDomain(consentTerm);
	}

	async findUnique({ type, version }: IParams): Promise<ConsentTerm | null> {
		const consentTerm = await prisma.consentTerm.findUnique({
			where: {
				type_version: {
					type,
					version,
				},
			},
		});

		if (!consentTerm) {
			return null;
		}

		return ConsentTermMapper.toDomain(consentTerm);
	}
}
