// OBS.: Use case será usado de forma temporária para testes

import { inject, injectable } from 'tsyringe';

import type { IBlingAuthentication } from '@/services/bling/repositories/bling-authentication';
import type {
	IBlingContactPersonType,
	IBlingContactSituation,
	IBlingGateway,
} from '@/services/bling/repositories/bling-gateway';

import { failure, success, type Outcome } from '@/core/outcome';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { getBlingErrorMessage } from '@/services/bling/helpers/get-bling-error-message';

interface IRequest {
	name: string;
	email?: string | null;
	phone?: string | null;
	document?: string | null;
	personType?: IBlingContactPersonType;
	situation?: IBlingContactSituation;
	address?: {
		zipCode?: string | null;
		street?: string | null;
		number?: string | null;
		complement?: string | null;
		district?: string | null;
		city?: string | null;
		state?: string | null;
	} | null;
}

type Response = Outcome<
	ResourceNotFoundError | BadRequestError,
	{
		blingContactId: number;
		rawPayload: unknown;
	}
>;

@injectable()
export class CreateBlingContactUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.BLING_GATEWAY_SERVICE)
		private blingGateway: IBlingGateway,
		@inject(DEPENDENCY_IDENTIFIERS.BLING_AUTHENTICATION)
		private blingAuthentication: IBlingAuthentication
	) {}

	async execute(input: IRequest): Promise<Response> {
		const tokenResult = await this.blingAuthentication.getValidBlingAccessToken({});

		try {
			const contact = await this.blingGateway.createContact({
				accessToken: tokenResult.accessToken,
				name: input.name,
				email: input.email,
				phone: input.phone,
				document: input.document,
				personType: input.personType,
				address: input.address,
			});

			return success({
				blingContactId: contact.id,
				rawPayload: contact.rawPayload,
			});
		} catch (error) {
			return failure(new BadRequestError(getBlingErrorMessage(error), 'BLING_CREATE_CONTACT_FAILED'));
		}
	}
}
