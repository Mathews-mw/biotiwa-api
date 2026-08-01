import { env } from '@/env';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@/generated/prisma/client';

const connectionString = `${env.DATABASE_URL}`;

const globalForPrisma = global as unknown as {
	prisma: PrismaClient;
	migrations: {
		path: 'prisma/migrations';
		seed: 'tsx prisma/seed.ts';
	};
};

const adapter = new PrismaPg({ connectionString }, { schema: 'biotiwa' });

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter, log: ['warn', 'error'] });

export { prisma };
