import z from 'zod';

export const countryCodeSchema = z.enum(['BR', 'US']);

export type ICountryCode = z.infer<typeof countryCodeSchema>;
