import { Prisma } from '@/generated/prisma/client';

export function toPrismaJson(value: unknown | undefined | null): Prisma.InputJsonValue | typeof Prisma.JsonNull {
	if (value === undefined || value === null) {
		return Prisma.JsonNull;
	}

	return value as Prisma.InputJsonValue;
}
