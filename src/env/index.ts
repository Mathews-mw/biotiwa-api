import z from 'zod';
import process from 'node:process';

export const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	PORT: z.coerce.number().default(3734),
	HOST: z.string().default('0.0.0.0'),
	DATABASE_URL: z.string(),
	DIRECT_URL: z.string(),
	BETTER_AUTH_SECRET: z.string(),
	BETTER_AUTH_URL: z.url(),
	WEB_APP_URL: z.url(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (parsedEnv.success === false) {
	console.log('❌ Invalid environment variables:', parsedEnv.error.format());

	throw new Error('Invalid environment variables');
}

export const env = parsedEnv.data;
