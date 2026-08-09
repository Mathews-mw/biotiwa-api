import { z } from 'zod';

import { productSchema } from './product-schema';
import { offerItemSchema } from './offer-item-schema';

export const offerItemDetailsSchema = offerItemSchema.extend({
	product: productSchema,
});

export type IOfferItemDetailsResponseSchema = z.infer<typeof offerItemDetailsSchema>;
