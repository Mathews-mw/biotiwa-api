import { inject, injectable } from 'tsyringe';

import type { IBlingAuthentication } from '@/services/bling/repositories/bling-authentication';

import { failure, success, type Outcome } from '@/core/outcome';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	forceRefresh?: boolean;
}

type Response = Outcome<
	ResourceNotFoundError | BadRequestError,
	{
		accessToken: string;
		connectionId: string;
		expiresAt: Date;
	}
>;

@injectable()
export class GetValidBlingAccessTokenUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.BLING_AUTHENTICATION)
		private blingAuthentication: IBlingAuthentication
	) {}

	async execute({ forceRefresh = false }: IRequest = {}): Promise<Response> {
		try {
			const result = await this.blingAuthentication.getValidBlingAccessToken({ forceRefresh });

			return success({
				accessToken: result.accessToken,
				connectionId: result.connectionId,
				expiresAt: result.expiresAt,
			});
		} catch (error) {
			if (error instanceof ResourceNotFoundError || error instanceof BadRequestError) {
				return failure(error);
			}

			console.log('Get valid bling access token error: ', error);

			return failure(
				new BadRequestError(
					'An error occurred while attempting to generate a valid Bling access token.',
					'BLING_TOKEN_REFRESH_FAILED'
				)
			);
		}
	}
}
