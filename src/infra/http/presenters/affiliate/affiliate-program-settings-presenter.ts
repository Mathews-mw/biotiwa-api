import { AffiliateProgramSettings } from '@/domains/main/models/entities/affiliate-program-settings';
import type { IAffiliateProgramSettingsResponseSchema } from '../../schemas/affiliates/affiliate-program-settings-schema';

export class AffiliateProgramSettingsPresenter {
	static toHTTP(data: AffiliateProgramSettings): IAffiliateProgramSettingsResponseSchema {
		return {
			id: data.id.toString(),
			market_code: data.marketCode,
			min_code_lifetime_days: data.minCodeLifetimeDays,
			max_code_lifetime_days: data.maxCodeLifetimeDays,
			attribution_window_days: data.attributionWindowDays,
			self_service_code_creation_enabled: data.selfServiceCodeCreationEnabled,
			max_active_codes_per_affiliate: data.maxActiveCodesPerAffiliate,
			default_affiliate_discount_type: data.defaultAffiliateDiscountType,
			default_affiliate_discount_value: data.defaultAffiliateDiscountValue,
			default_affiliate_commission_rate: data.defaultAffiliateCommissionRate,
			max_uses_per_customer_limit: data.maxUsesPerCustomerLimit,
			is_active: data.isActive,
			created_at: data.createdAt,
			updated_at: data.updatedAt ?? null,
		};
	}
}
