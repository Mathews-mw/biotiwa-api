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

	STRIPE_SECRET_KEY: z.string(),
	STRIPE_WEBHOOK_SECRET: z.string(),
	STRIPE_SUCCESS_URL: z.url(),
	STRIPE_CANCEL_URL: z.url(),

	BLING_CLIENT_ID: z.string(),
	BLING_CLIENT_SECRET: z.string(),
	BLING_REDIRECT_URL: z.url(),
	BLING_API_BASE_URL: z.url(),
	BLING_AUTHORIZE_URL: z.url(),
	BLING_TOKEN_URL: z.url(),

	CRON_SECRET: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (parsedEnv.success === false) {
	console.log('❌ Invalid environment variables:', parsedEnv.error.format());

	throw new Error('Invalid environment variables');
}

export const env = parsedEnv.data;
