import type { CursorSchemaResponse, PaginationSchemaResponse } from '../schemas/pagination-schema';
import type { ICursorResponse, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';

export class PaginationPresenter {
	static paginationModeToHTTP(pagination: IPaginationResponse): PaginationSchemaResponse {
		return {
			page: pagination.page,
			per_page: pagination.perPage,
			total_occurrences: pagination.totalOccurrences,
			total_pages: pagination.totalPages,
		};
	}

	static cursorModeToHTTP(cursor: ICursorResponse): CursorSchemaResponse {
		return {
			has_more: cursor.hasMore,
			next_cursor: cursor.nextCursor,
			previous_cursor: cursor.previousCursor,
		};
	}
}
