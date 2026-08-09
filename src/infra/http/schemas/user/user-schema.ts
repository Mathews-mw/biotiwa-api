import { z } from 'zod';
import { rolesSchema } from '@/core/auth/roles';

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.email(),
	email_verified: z.boolean(),
	image: z.string().nullable(),
	role: rolesSchema,
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable(),
});

export type IUserResponseSchema = z.infer<typeof userSchema>;
