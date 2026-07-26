import z from 'zod';

export const marketCodeSchema = z.enum(['BR', 'US']);

export type IMarketCode = z.infer<typeof marketCodeSchema>;
