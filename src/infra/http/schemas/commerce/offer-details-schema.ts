import { z } from 'zod';

import { offerSchema } from './offer-schema';
import { offerItemDetailsSchema } from './offer-item-details-schema';

export const offerDetailsSchema = offerSchema.extend({
	items: z.array(offerItemDetailsSchema),
});

export type IOfferDetailsResponseSchema = z.infer<typeof offerDetailsSchema>;
