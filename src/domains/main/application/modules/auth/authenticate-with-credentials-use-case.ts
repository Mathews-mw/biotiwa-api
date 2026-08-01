import { inject, injectable } from 'tsyringe';

import type { IIdentityProvider } from '../../ports/identity-provider';
import type { IUserRepository } from '../users/repositories/user-repository';

import { failure, Outcome, success } from '@/core/outcome';
import { User } from '@/domains/main/models/entities/user';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	email: string;
	password: string;
	context: {
		headers: Record<string, string | string[] | undefined>;
		ip?: string;
		userAgent?: string;
	};
}

type Response = Outcome<UnauthorizedError, { user: User; responseHeaders: Array<{ name: string; value: string }> }>;

@injectable()
export class AuthenticateWithCredentialsUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository,
		@inject(DEPENDENCY_IDENTIFIERS.IDENTITY_PROVIDER) private identityProvider: IIdentityProvider
	) {}

	async execute({ email, password, context }: IRequest): Promise<Response> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			return failure(new UnauthorizedError('Invalid credentials!', 'AUTH_INVALID_CREDENTIALS_ERROR'));
		}

		const authResult = await this.identityProvider.signInWithEmailAndPassword({ email, password, context });

		return success({
			user,
			responseHeaders: authResult.responseHeaders,
		});
	}
}
