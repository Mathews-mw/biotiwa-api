import { env } from '@/env';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { prisma } from '../database/prisma';

export const auth = betterAuth({
	appName: 'Bio Tiwa API',
	baseURL: env.BETTER_AUTH_URL,
	trustedOrigins: [env.WEB_APP_URL],
	secret: env.BETTER_AUTH_SECRET,
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		maxPasswordLength: 128,
		autoSignIn: true,
		// Tornar true somente quando o serviço de e-mail estiver implementado
		requireEmailVerification: false,
	},
	user: {
		additionalFields: {
			role: {
				type: 'string',
				required: false,
				defaultValue: 'CUSTOMER',
			},
		},
	},
	account: {
		additionalFields: {
			provider: {
				type: 'string',
				required: false,
				defaultValue: 'CREDENTIALS',
			},
		},
	},
});
