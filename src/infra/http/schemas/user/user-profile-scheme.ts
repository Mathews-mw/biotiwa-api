import { z } from 'zod';
import { userSchema } from './user-schema';
import { customerProfileSchema } from './customer-profile-schema';

export const userProfileSchema = userSchema.extend({
	profile: customerProfileSchema.nullable().optional(),
});

export type IUserProfileResponseSchema = z.infer<typeof userProfileSchema>;
