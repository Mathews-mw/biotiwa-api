import { BlingConnection } from '@/domains/main/models/entities/integrations/bling-connection';

export type IUpsertActiveBlingConnectionInput = {
	accessToken: string;
	refreshToken: string;
	expiresAt: Date;
	scope?: string | null;
};

export interface IBlingConnectionRepository {
	save(connection: BlingConnection): Promise<BlingConnection>;
	upsertActive(input: IUpsertActiveBlingConnectionInput): Promise<BlingConnection>;
	findActive(): Promise<BlingConnection | null>;
}
