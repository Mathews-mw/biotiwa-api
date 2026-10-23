import { z } from 'zod';

import { userSchema } from '../user/user-schema';
import { affiliateSchema } from './affiliate-schema';

export const affiliateDetailsSchema = z.object({
	affiliate: affiliateSchema,
	user: userSchema,
});

export type IAffiliateDetailsResponseSchema = z.infer<typeof affiliateDetailsSchema>;
