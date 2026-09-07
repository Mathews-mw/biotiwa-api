export interface IMelhorEnvioOAuthStateRepository {
	create(input: { state: string; expiresAt: Date }): Promise<void>;
	consume(state: string): Promise<boolean>;
}
