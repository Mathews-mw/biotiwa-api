export interface IValidationAccessTokenRequest {
	forceRefresh?: boolean;
}

export interface IValidationAccessTokenResponse {
	accessToken: string;
	connectionId: string;
	expiresAt: Date;
}

export type IBlingTokenResponse = {
	access_token: string;
	expires_in: number;
	token_type: 'Bearer';
	scope?: string;
	refresh_token: string;
};

export interface IBlingAuthentication {
	exchangeCodeForTokens(code: string): Promise<IBlingTokenResponse>;
	refreshAccessToken(refreshToken: string): Promise<IBlingTokenResponse>;
	getValidBlingAccessToken(input: IValidationAccessTokenRequest): Promise<IValidationAccessTokenResponse>;
}
