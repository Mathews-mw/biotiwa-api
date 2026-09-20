import { StripeWebhookEvent } from '@/domains/events/models/stripe-webhook-event';

export type IStartStripeWebhookEventProcessingResult = {
	event: StripeWebhookEvent;
	shouldProcess: boolean;
};

export interface IStripeWebhookEventRepository {
	startProcessing(event: StripeWebhookEvent): Promise<IStartStripeWebhookEventProcessingResult>;
	findByProviderEventId(providerEventId: string): Promise<StripeWebhookEvent | null>;
	save(event: StripeWebhookEvent): Promise<StripeWebhookEvent>;
}
