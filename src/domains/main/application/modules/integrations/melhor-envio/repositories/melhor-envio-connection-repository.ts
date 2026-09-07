import { MelhorEnvioConnection } from '@/domains/main/models/entities/integrations/melhor-envio-connection';

export interface IUpsertActiveMelhorEnvioConnectionInput {
	accessToken: string;
	refreshToken: string;
	expiresAt: Date;
	scope?: string | null;
}

export interface IMelhorEnvioConnectionRepository {
	save(connection: MelhorEnvioConnection): Promise<MelhorEnvioConnection>;
	upsertActive(input: IUpsertActiveMelhorEnvioConnectionInput): Promise<MelhorEnvioConnection>;
	findActive(): Promise<MelhorEnvioConnection | null>;
}
