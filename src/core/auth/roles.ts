import z from 'zod';

export const rolesSchema = z.enum(['ADMIN', 'CUSTOMER']);

export type IRole = z.infer<typeof rolesSchema>;
