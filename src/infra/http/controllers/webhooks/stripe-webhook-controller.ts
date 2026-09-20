import Stripe from 'stripe';
import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { env } from '@/env';
import { getErrorMessage } from '@/utils/get-error-message';
import { stripe } from '@/services/payments/gateways/stripe/stripe';
import { FailStripeCheckoutSessionUseCase } from '@/domains/main/application/modules/payments/use-cases/stripe/fail-stripe-checkout-session-use-case';
import { ExpireStripeCheckoutSessionUseCase } from '@/domains/main/application/modules/payments/use-cases/stripe/expire-stripe-checkout-session-use-case';
import { ConfirmStripeCheckoutSessionUseCase } from '@/domains/main/application/modules/payments/use-cases/stripe/confirm-stripe-checkout-session-use-case';
import { MarkStripeWebhookEventAsFailedUseCase } from '@/domains/events/application/modules/stripe/use-cases/mark-stripe-webhook-event-as-failed-use-case';
import { StartStripeWebhookEventProcessingUseCase } from '@/domains/events/application/modules/stripe/use-cases/start-stripe-webhook-event-processing-use-case';
import { MarkStripeWebhookEventAsProcessedUseCase } from '@/domains/events/application/modules/stripe/use-cases/mark-stripe-webhook-event-as-processed-use-case';

const supportedStripeEvents = [
	'checkout.session.completed',
	'checkout.session.async_payment_succeeded',
	'checkout.session.async_payment_failed',
	'checkout.session.expired',
] as const;

export async function stripeWebhookController(request: FastifyRequest, reply: FastifyReply) {
	const signature = request.headers['stripe-signature'];

	if (!signature || Array.isArray(signature)) {
		return reply.status(400).send({ error: 'Missing Stripe signature' });
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(request.rawBody as string | Buffer, signature, env.STRIPE_WEBHOOK_SECRET);
	} catch {
		return reply.status(400).send({ error: 'Invalid Stripe signature' });
	}

	if (!isSupportedStripeEvent(event.type)) {
		return reply.status(200).send({
			received: true,
			ignored: true,
		});
	}

	const session = event.data.object as Stripe.Checkout.Session;

	const startProcessingUseCase = container.resolve(StartStripeWebhookEventProcessingUseCase);

	const startProcessingResult = await startProcessingUseCase.execute({
		providerEventId: event.id,
		providerObjectId: session.id,
		eventType: event.type,
	});

	console.log('startProcessingResult: ', startProcessingResult);

	if (startProcessingResult.value.shouldProcess === false) {
		return reply.status(200).send({
			received: true,
			duplicated: true,
		});
	}

	try {
		switch (event.type) {
			case 'checkout.session.completed':
				await handleCheckoutSessionCompleted(event);
				break;

			case 'checkout.session.async_payment_succeeded':
				await handleCheckoutSessionPaid(event);
				break;

			case 'checkout.session.async_payment_failed':
				await handleCheckoutSessionFailed(event);
				break;

			case 'checkout.session.expired':
				await handleCheckoutSessionExpired(event);
				break;

			default:
				break;
		}

		const markAsProcessedUseCase = container.resolve(MarkStripeWebhookEventAsProcessedUseCase);

		await markAsProcessedUseCase.execute({
			providerEventId: event.id,
		});

		return reply.status(200).send({
			received: true,
		});
	} catch (error) {
		const markAsFailedUseCase = container.resolve(MarkStripeWebhookEventAsFailedUseCase);

		await markAsFailedUseCase.execute({
			providerEventId: event.id,
			errorMessage: getErrorMessage(error),
		});

		throw error;
	}
}

async function handleCheckoutSessionCompleted(event: Stripe.Event) {
	const session = event.data.object as Stripe.Checkout.Session;

	if (session.payment_status !== 'paid') {
		return;
	}

	await handleCheckoutSessionPaid(event);
}

async function handleCheckoutSessionPaid(event: Stripe.Event) {
	const session = event.data.object as Stripe.Checkout.Session;
	console.log('session: ', session);

	const orderId = session.metadata?.order_id;

	if (!orderId) {
		console.warn('Stripe session without order_id metadata', {
			eventId: event.id,
			sessionId: session.id,
		});

		return;
	}

	const useCase = container.resolve(ConfirmStripeCheckoutSessionUseCase);

	const result = await useCase.execute({
		orderId,
		providerSessionId: session.id,
		providerPaymentIntent: typeof session.payment_intent === 'string' ? session.payment_intent : null,
		rawPayload: session,
	});

	if (result.isFalse()) {
		throw result.value;
	}
}

async function handleCheckoutSessionFailed(event: Stripe.Event) {
	const session = event.data.object as Stripe.Checkout.Session;

	const orderId = session.metadata?.order_id;

	if (!orderId) {
		throw new Error('Missing order metadata');
	}

	const useCase = container.resolve(FailStripeCheckoutSessionUseCase);

	const result = await useCase.execute({
		orderId,
		providerSessionId: session.id,
		rawPayload: session,
	});

	if (result.isFalse()) {
		throw result.value;
	}
}

async function handleCheckoutSessionExpired(event: Stripe.Event) {
	const session = event.data.object as Stripe.Checkout.Session;

	const orderId = session.metadata?.order_id;

	if (!orderId) {
		throw new Error('Missing order metadata');
	}

	const useCase = container.resolve(ExpireStripeCheckoutSessionUseCase);

	const result = await useCase.execute({
		orderId,
		providerSessionId: session.id,
		rawPayload: session,
	});

	if (result.isFalse()) {
		throw result.value;
	}
}

function isSupportedStripeEvent(eventType: string) {
	return supportedStripeEvents.includes(eventType as (typeof supportedStripeEvents)[number]);
}
