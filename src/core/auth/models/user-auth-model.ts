import z from 'zod';

import { rolesSchema } from '../roles';

export const userAuthSchema = z.object({
	id: z.string(),
	role: rolesSchema,
});

export type IUserAuth = z.infer<typeof userAuthSchema>;
