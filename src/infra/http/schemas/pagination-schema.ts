import z from 'zod';

export const paginationQuerySchema = z.object({
	page: z
		.optional(z.coerce.number().int().nonnegative())
		.default(1)
		.describe(
			"The current page that you want int the request. It's only necessary when the `total_pages` is greater than 1."
		),
	per_page: z
		.optional(z.union([z.coerce.number().int().nonnegative(), z.literal('all')]))
		.default(10)
		.describe(
			'The number of records you want returned in the pagination. You can provide the value `all` or any number greater than 1. If you chose the value `all`, it means that all records will be returned.'
		),
});

export const paginationResponseSchema = z.object({
	page: z.coerce.number().int().nonnegative().describe('The current page'),
	per_page: z.coerce.number().int().nonnegative().describe('The amount of records per page'),
	total_occurrences: z.coerce.number().nonnegative().int().describe('The amount of total records.'),
	total_pages: z.coerce.number().int().nonnegative().describe('A number of pagination pages'),
});

export type PaginationSchemaResponse = z.infer<typeof paginationResponseSchema>;

export const cursorQuerySchema = z.object({
	limit: z.coerce.number().int().nonnegative().describe('the number of records to be returned in each page.'),
	cursor: z.optional(z.string()),
	skip: z.optional(z.coerce.number().int().nonnegative()),
});

export const cursorResponseSchema = z.object({
	next_cursor: z.optional(z.string()),
	previous_cursor: z.optional(z.string()),
	has_more: z.coerce.boolean(),
});

export type CursorSchemaQuery = z.infer<typeof cursorQuerySchema>;
export type CursorSchemaResponse = z.infer<typeof cursorResponseSchema>;
