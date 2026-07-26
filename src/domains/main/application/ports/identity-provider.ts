export interface IIdentityProvider {
	registerWithEmailAndPassword(input: IRegisterWithEmailAndPasswordInput): Promise<IRegisterWithEmailAndPasswordOutput>;
	signInWithEmailAndPassword(input: ISignInWithEmailAndPasswordInput): Promise<ISignInWithEmailAndPasswordOutput>;
	getSession(input: IGetSessionInput): Promise<IAuthSession | null>;
	signOut(input: ISignOutInput): Promise<ISignOutOutput>;
}

export interface IRequestAuthContext {
	headers: Record<string, string | string[] | undefined>;
	ip?: string;
	userAgent?: string;
}

export interface IResponseHeader {
	name: string;
	value: string;
}

export interface IAuthUser {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image?: string | null;
	role?: string | null;
}

export interface IAuthSession {
	user: IAuthUser;
	sessionId?: string;
	expiresAt?: Date;
}

export interface IRegisterWithEmailAndPasswordInput {
	name: string;
	email: string;
	password: string;
	image?: string;
	context: IRequestAuthContext;
}

export interface IRegisterWithEmailAndPasswordOutput {
	user: IAuthUser;
	responseHeaders: IResponseHeader[];
}

export interface ISignInWithEmailAndPasswordInput {
	email: string;
	password: string;
	context: IRequestAuthContext;
}

export interface ISignInWithEmailAndPasswordOutput {
	user: IAuthUser;
	responseHeaders: IResponseHeader[];
}

export interface IGetSessionInput {
	context: IRequestAuthContext;
}

export interface ISignOutInput {
	context: IRequestAuthContext;
}

export interface ISignOutOutput {
	responseHeaders: IResponseHeader[];
}
