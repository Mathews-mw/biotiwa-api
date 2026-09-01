import z from 'zod';
import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { getAuthenticatedSession } from '@/infra/http/helpers/get-authenticated-session';
import { CreateBlingContactUseCase } from '@/domains/main/application/modules/integrations/bling/use-cases/create-bling-contact-use-case';

export const createBlingContactBodySchema = z.object({
	name: z.string().min(1),
	email: z.email().optional().nullable(),
	phone: z.string().optional().nullable(),
	document: z.string().optional().nullable(),
	person_type: z.enum(['F', 'J', 'E']).default('F'),
	situation: z.enum(['A', 'E', 'I', 'S']).default('A'),
	address: z
		.object({
			zip_code: z.string().optional().nullable(),
			street: z.string().optional().nullable(),
			number: z.string().optional().nullable(),
			complement: z.string().optional().nullable(),
			district: z.string().optional().nullable(),
			city: z.string().optional().nullable(),
			state: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
});

export async function createBlingContactController(request: FastifyRequest, reply: FastifyReply) {
	getAuthenticatedSession(request);

	const validationResult = createBlingContactBodySchema.safeParse(request.body);

	if (!validationResult.success) {
		return reply.status(400).send({ message: 'Validation error' });
	}

	const { name, email, phone, document, person_type, situation, address } = validationResult.data;

	const service = container.resolve(CreateBlingContactUseCase);

	const result = await service.execute({
		name,
		email,
		phone,
		document,
		personType: person_type,
		situation,
		address: address
			? {
					zipCode: address.zip_code,
					street: address.street,
					number: address.number,
					complement: address.complement,
					district: address.district,
					city: address.city,
					state: address.state,
				}
			: null,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send(result.value);
}
