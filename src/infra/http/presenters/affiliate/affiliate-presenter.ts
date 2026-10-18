import { Affiliate } from '@/domains/main/models/entities/affiliate';
import type { IAffiliateResponseSchema } from '../../schemas/affiliates/affiliate-schema';

export class AffiliatePresenter {
	static toHTTP(data: Affiliate): IAffiliateResponseSchema {
		return {
			id: data.id.toString(),
			user_id: data.userId.toString(),
			type: data.type,
			status: data.status,
			created_at: data.createdAt,
			updated_at: data.updatedAt ?? null,
		};
	}
}
