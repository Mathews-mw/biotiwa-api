import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { releaseEligibleAffiliateCommissionsSchema } from '../schemas/affiliates/release-eligible-affiliate-commissions-schema';
import { releaseEligibleAffiliateCommissionsController } from '../controllers/affiliates/release-eligible-affiliate-commissions-controller';

export async function adminRoutes(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.post(
			'/affiliates/commissions/release-eligible',
			{ preHandler: [authMiddleware], schema: releaseEligibleAffiliateCommissionsSchema },
			releaseEligibleAffiliateCommissionsController
		);
}
