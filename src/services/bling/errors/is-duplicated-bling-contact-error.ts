// src/services/integrations/bling/helpers/is-duplicated-bling-contact-error.ts

import { BlingGatewayError } from '../errors/bling-gateway-error';

type BlingValidationErrorResponse = {
	error?: {
		type?: string;
		message?: string;
		description?: string;
		fields?: Array<{
			code?: number;
			msg?: string;
			element?: string;
			namespace?: string;
		}>;
	};
};

export function isDuplicatedBlingContactError(error: unknown) {
	if (!(error instanceof BlingGatewayError)) {
		return false;
	}

	const responseBody = error.responseBody as BlingValidationErrorResponse | undefined;

	if (responseBody?.error?.type !== 'VALIDATION_ERROR') {
		return false;
	}

	const fields = responseBody.error.fields ?? [];

	return fields.some((field) => {
		const namespace = field.namespace?.toUpperCase();
		const element = field.element?.toLowerCase();
		const message = field.msg?.toLowerCase() ?? '';

		const isContactNamespace = namespace === 'CONTATOS';

		const isDocumentField = element === 'cpf' || element === 'cnpj' || element === 'numeroDocumento'.toLowerCase();

		const isDuplicatedMessage =
			message.includes('já está cadastrado') ||
			message.includes('ja esta cadastrado') ||
			message.includes('já cadastrado') ||
			message.includes('ja cadastrado');

		return isContactNamespace && isDocumentField && isDuplicatedMessage;
	});
}
