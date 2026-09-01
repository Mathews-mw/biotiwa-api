import { inject, injectable } from 'tsyringe';

import type { IBlingConnectionRepository } from '../repositories/bling-connection-repository';
import type { IBlingAuthentication } from '@/services/bling/repositories/bling-authentication';

import { success, type Outcome } from '@/core/outcome';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	code: string;
}

type Response = Outcome<never, null>;

@injectable()
export class HandleBlingOAuthCallbackUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.BLING_AUTHENTICATION)
		private blingAuthentication: IBlingAuthentication,
		@inject(DEPENDENCY_IDENTIFIERS.BLING_CONNECTION_REPOSITORY)
		private blingConnectionRepository: IBlingConnectionRepository
	) {}

	async execute({ code }: IRequest): Promise<Response> {
		const tokens = await this.blingAuthentication.exchangeCodeForTokens(code);

		const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

		await this.blingConnectionRepository.upsertActive({
			accessToken: tokens.access_token,
			refreshToken: tokens.refresh_token,
			expiresAt,
			scope: tokens.scope ?? null,
		});

		return success(null);
	}
}
