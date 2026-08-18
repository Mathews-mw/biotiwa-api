import { inject, injectable } from 'tsyringe';

import { success, type Outcome } from '@/core/outcome';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

import type { IStripeWebhookEventRepository } from '../repositories/stripe-webhook-event-repository';

interface IRequest {
	providerEventId: string;
}

type Response = Outcome<never, null>;

@injectable()
export class MarkStripeWebhookEventAsProcessedUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.STRIPE_WEBHOOK_EVENT_REPOSITORY)
		private stripeWebhookEventRepository: IStripeWebhookEventRepository
	) {}

	async execute({ providerEventId }: IRequest): Promise<Response> {
		const event = await this.stripeWebhookEventRepository.findByProviderEventId(providerEventId);

		if (!event) {
			return success(null);
		}

		event.markAsProcessed();

		await this.stripeWebhookEventRepository.save(event);

		return success(null);
	}
}
