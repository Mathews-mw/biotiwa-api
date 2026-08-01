import z from 'zod';

export const currencyCodeSchema = z.enum(['BRL', 'USD']);

export type ICurrencyCode = z.infer<typeof currencyCodeSchema>;
