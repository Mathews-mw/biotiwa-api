import { inject, injectable } from 'tsyringe';

import type { IIdentityProvider, IRequestAuthContext } from '../../ports/identity-provider';

import { Outcome, success } from '@/core/outcome';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	context: IRequestAuthContext;
}

type Response = Outcome<
	null,
	{
		responseHeaders: Array<{
			name: string;
			value: string;
		}>;
	}
>;

@injectable()
export class SignOutUserUseCase {
	constructor(@inject(DEPENDENCY_IDENTIFIERS.IDENTITY_PROVIDER) private identityProvider: IIdentityProvider) {}

	async execute({ context }: IRequest): Promise<Response> {
		const result = await this.identityProvider.signOut({
			context,
		});

		return success({
			responseHeaders: result.responseHeaders,
		});
	}
}
