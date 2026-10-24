import { z } from 'zod';
import { userSchema } from './user-schema';
import { customerProfileSchema } from './customer-profile-schema';
import { affiliateSchema } from '../affiliates/affiliate-schema';

export const userProfileSchema = userSchema.extend({
	profile: customerProfileSchema.nullable().optional(),
	affiliate: affiliateSchema.nullable().optional(),
});

export type IUserProfileResponseSchema = z.infer<typeof userProfileSchema>;
