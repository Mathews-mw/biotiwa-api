import z from 'zod';

import { code400Schema } from '@/core/errors/bad-request-errors';
import { code401Schema } from '@/core/errors/unauthorized-error';
import { code403Schema } from '@/core/errors/forbidden-error';
import { code404Schema } from '@/core/errors/resource-not-found-error';

export const badRequestErrorSchema = z.object({
	status: z.number(),
	message: z.string(),
	code: code400Schema,
});

export const unauthorizedErrorSchema = z.object({
	status: z.number(),
	message: z.string(),
	code: code401Schema,
});

export const forbiddenErrorSchema = z.object({
	status: z.number(),
	message: z.string(),
	code: code403Schema,
});

export const resourceNotFoundErrorSchema = z.object({
	status: z.number(),
	message: z.string(),
	code: code404Schema,
});
