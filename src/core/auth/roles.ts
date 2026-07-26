import z from 'zod';

// type Role = "ADMIN" | "CUSTOMER" <=> z.enum(['ADMIN','CUSTOMER'])

export const rolesSchema = z.enum(['ADMIN', 'CUSTOMER']);

export type IRole = z.infer<typeof rolesSchema>;
