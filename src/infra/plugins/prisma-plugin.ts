import fp from 'fastify-plugin';
import { prisma } from '../database/prisma';

export const prismaPlugin = fp(async (app) => {
	app.addHook('onClose', async () => {
		await prisma.$disconnect();
	});
});
