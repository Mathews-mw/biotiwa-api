import type { FastifyReply } from 'fastify';

import { IResponseHeader } from '@/domains/main/application/ports/identity-provider';

export function applyResponseHeaders(reply: FastifyReply, headers: IResponseHeader[]) {
	const setCookies: string[] = [];

	for (const header of headers) {
		if (header.name.toLowerCase() === 'set-cookie') {
			setCookies.push(header.value);
			continue;
		}

		reply.header(header.name, header.value);
	}

	if (setCookies.length > 0) {
		reply.header('set-cookie', setCookies);
	}

	console.log('setCookies: ', setCookies);
}
