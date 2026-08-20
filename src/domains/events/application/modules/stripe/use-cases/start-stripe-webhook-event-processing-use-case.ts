import { inject, injectable } from 'tsyringe';

import { success, type Outcome } from '@/core/outcome';
import { StripeWebhookEvent } from '@/domains/events/models/stripe-webhook-event';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

import type {
	IStripeWebhookEventRepository,
	IStartStripeWebhookEventProcessingResult,
} from '../repositories/stripe-webhook-event-repository';

interface IRequest {
	providerEventId: string;
	providerObjectId?: string | null;
	eventType: string;
}

type Response = Outcome<never, IStartStripeWebhookEventProcessingResult>;

@injectable()
export class StartStripeWebhookEventProcessingUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.STRIPE_WEBHOOK_EVENT_REPOSITORY)
		private stripeWebhookEventRepository: IStripeWebhookEventRepository
	) {}

	async execute(input: IRequest): Promise<Response> {
		const event = StripeWebhookEvent.create({
			providerEventId: input.providerEventId,
			providerObjectId: input.providerObjectId ?? null,
			eventType: input.eventType,
		});

		const result = await this.stripeWebhookEventRepository.startProcessing(event);

		return success(result);
	}
}
