export type IMelhorEnvioTokenResponse = {
	token_type: 'Bearer';
	expires_in: number;
	access_token: string;
	refresh_token: string;
	scope?: string;
};

export interface IMelhorEnvioAuthentication {
	exchangeCodeForTokens(code: string): Promise<IMelhorEnvioTokenResponse>;
	refreshAccessToken(refreshToken: string): Promise<IMelhorEnvioTokenResponse>;
}
