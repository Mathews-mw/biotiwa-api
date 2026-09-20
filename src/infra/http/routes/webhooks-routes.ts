import { FastifyInstance } from 'fastify';

import { stripeWebhookController } from '../controllers/webhooks/stripe-webhook-controller';

export async function webhooksRoutes(app: FastifyInstance) {
	app.post('/stripe', { config: { rawBody: true }, schema: { hide: true } }, stripeWebhookController);
}
