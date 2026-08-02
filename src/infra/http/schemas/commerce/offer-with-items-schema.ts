import { z } from 'zod';

import { offerSchema } from './offer-schema';
import { offerItemSchema } from './offer-item-schema';

export const offerWithItemsSchema = offerSchema.extend({
	items: z.array(offerItemSchema),
});

export type IOfferWithItemsResponseSchema = z.infer<typeof offerWithItemsSchema>;
