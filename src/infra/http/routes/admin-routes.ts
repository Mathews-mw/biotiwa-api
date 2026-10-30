import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { verifyUserPermissions } from '../middlewares/permission-middleware';
import { approvalAffiliateRegistrationSchema } from '../schemas/affiliates/approval-affiliate-registration-schema';
import { approvalAffiliateRegistrationController } from '../controllers/affiliates/approval-affiliate-registration-controller';
import { releaseEligibleAffiliateCommissionsSchema } from '../schemas/affiliates/release-eligible-affiliate-commissions-schema';
import { releaseEligibleAffiliateCommissionsController } from '../controllers/affiliates/release-eligible-affiliate-commissions-controller';

export async function adminRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().patch(
		'/affiliates/:affiliateId/approval',
		{
			preHandler: [authMiddleware, verifyUserPermissions('Affiliate', 'update')],
			schema: approvalAffiliateRegistrationSchema,
		},
		approvalAffiliateRegistrationController
	);

	app.withTypeProvider<ZodTypeProvider>().post(
		'/affiliates/commissions/release-eligible',
		{
			preHandler: [authMiddleware, verifyUserPermissions('AffiliateCommission', 'update')],
			schema: releaseEligibleAffiliateCommissionsSchema,
		},
		releaseEligibleAffiliateCommissionsController
	);
}
