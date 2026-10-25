import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { registerAffiliateSchema } from '../schemas/affiliates/register-affiliate-schema';
import { listingAffiliatesResponseSchema } from '../schemas/affiliates/listing-affiliates-schema';
import { listAffiliateSalesResponseSchema } from '../schemas/affiliates/list-affiliate-sales-schema';
import { registerAffiliateController } from '../controllers/affiliates/register-affiliate-controller';
import { listingAffiliatesController } from '../controllers/affiliates/listing-affiliates-controller';
import { listAffiliateSalesController } from '../controllers/affiliates/list-affiliate-sales-controller';
import { getAffiliateDashboardResponseSchema } from '../schemas/affiliates/get-affiliate-dashboard-schema';
import { getAffiliateDashboardController } from '../controllers/affiliates/get-affiliate-dashboard-controller';
import { approvalAffiliateRegistrationSchema } from '../schemas/affiliates/approval-affiliate-registration-schema';
import { listAffiliatePromotionCodesResponseSchema } from '../schemas/affiliates/list-affiliate-promotion-codes-schema';
import { createOwnAffiliatePromotionCodeSchema } from '../schemas/affiliates/create-own-affiliate-promotion-code-schema';
import { listAffiliatePromotionCodesController } from '../controllers/affiliates/list-affiliate-promotion-codes-controller';
import { approvalAffiliateRegistrationController } from '../controllers/affiliates/approval-affiliate-registration-controller';
import { getAffiliatePromotionCodeSettingsResponseSchema } from '../schemas/affiliates/get-affiliate-promotion-cde-settings-schema';
import { createOwnAffiliatePromotionCodeController } from '../controllers/affiliates/create-own-affiliate-promotion-code-controller';
import { getAffiliatePromotionCodeSettingsController } from '../controllers/affiliates/get-affiliate-promotion-code-settings-controller';

export async function affiliatesRoutes(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.post('/register', { preHandler: [authMiddleware], schema: registerAffiliateSchema }, registerAffiliateController);

	app
		.withTypeProvider<ZodTypeProvider>()
		.post(
			'/admin/affiliate-commissions/release-eligible',
			{ preHandler: [authMiddleware], schema: createOwnAffiliatePromotionCodeSchema },
			createOwnAffiliatePromotionCodeController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.post(
			'/me/promotion-codes',
			{ preHandler: [authMiddleware], schema: createOwnAffiliatePromotionCodeSchema },
			createOwnAffiliatePromotionCodeController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.patch(
			'/:affiliateId/approval',
			{ preHandler: [authMiddleware], schema: approvalAffiliateRegistrationSchema },
			approvalAffiliateRegistrationController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get('/', { preHandler: [authMiddleware], schema: listingAffiliatesResponseSchema }, listingAffiliatesController);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/me/dashboard',
			{ preHandler: [authMiddleware], schema: getAffiliateDashboardResponseSchema },
			getAffiliateDashboardController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/me/sales',
			{ preHandler: [authMiddleware], schema: listAffiliateSalesResponseSchema },
			listAffiliateSalesController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/me/promotion-codes',
			{ preHandler: [authMiddleware], schema: listAffiliatePromotionCodesResponseSchema },
			listAffiliatePromotionCodesController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/me/promotion-code-settings',
			{ preHandler: [authMiddleware], schema: getAffiliatePromotionCodeSettingsResponseSchema },
			getAffiliatePromotionCodeSettingsController
		);
}
