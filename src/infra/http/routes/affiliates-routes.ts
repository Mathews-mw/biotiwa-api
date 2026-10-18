import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { listAffiliateSalesResponseSchema } from '../schemas/affiliates/list-affiliate-sales-schema';
import { listAffiliateSalesController } from '../controllers/affiliates/list-affiliate-sales-controller';
import { getAffiliateDashboardResponseSchema } from '../schemas/affiliates/get-affiliate-dashboard-schema';
import { getAffiliateDashboardController } from '../controllers/affiliates/get-affiliate-dashboard-controller';
import { listAffiliatePromotionCodesResponseSchema } from '../schemas/affiliates/list-affiliate-promotion-codes-schema';
import { listAffiliatePromotionCodesController } from '../controllers/affiliates/list-affiliate-promotion-codes-controller';

export async function affiliatesRoutes(app: FastifyInstance) {
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
}
