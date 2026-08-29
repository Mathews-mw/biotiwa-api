export type IBlingTokenResponse = {
	access_token: string;
	expires_in: number;
	token_type: 'Bearer';
	scope?: string;
	refresh_token: string;
};

export interface IBlingGateway {
	exchangeCodeForTokens(code: string): Promise<IBlingTokenResponse>;
	refreshAccessToken(refreshToken: string): Promise<IBlingTokenResponse>;
}
