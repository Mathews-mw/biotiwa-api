import 'fastify';

import type { IRole } from '@/core/auth/roles';

declare module 'fastify' {
	export interface FastifyRequest {
		session?: {
			userId: string;
			userEmail: string;
			userRole: IRole;
			sessionId?: string;
			expiresAt?: Date;
		};
	}
}
