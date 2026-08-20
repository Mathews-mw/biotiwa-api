import { forbiddenErrors } from '@/core/errors/forbidden-error';
import { badRequestErrors } from '@/core/errors/bad-request-errors';
import { unauthorizedErrors } from '@/core/errors/unauthorized-error';
import { notFoundErrors } from '@/core/errors/resource-not-found-error';

const getBadRequestErrorSchema = badRequestErrors;
const getForbiddenErrorSchema = forbiddenErrors;
const getNotFoundErrorSchema = notFoundErrors;
const getUnauthorizedErrorSchema = unauthorizedErrors;

export { getBadRequestErrorSchema, getForbiddenErrorSchema, getNotFoundErrorSchema, getUnauthorizedErrorSchema };
