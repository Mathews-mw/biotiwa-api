import { fromNodeHeaders } from 'better-auth/node';

import { auth } from './auth';

import type {
	IAuthSession,
	IAuthUser,
	IGetSessionInput,
	IIdentityProvider,
	IRegisterWithEmailAndPasswordInput,
	IRegisterWithEmailAndPasswordOutput,
	IResponseHeader,
	ISignInWithEmailAndPasswordInput,
	ISignInWithEmailAndPasswordOutput,
	ISignOutInput,
	ISignOutOutput,
} from '@/domains/main/application/ports/identity-provider';

function headersToArray(headers: Headers): Array<IResponseHeader> {
	const responseHeaders: IResponseHeader[] = [];

	headers.forEach((value, name) => {
		responseHeaders.push({
			name,
			value,
		});
	});

	return responseHeaders;
}

function mapBetterAuthUser(user: {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image?: string | null;
	role?: string | null;
}): IAuthUser {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		emailVerified: user.emailVerified,
		image: user.image,
		role: user.role,
	};
}

export class BetterAuthIdentityProvider implements IIdentityProvider {
	async registerWithEmailAndPassword(
		input: IRegisterWithEmailAndPasswordInput
	): Promise<IRegisterWithEmailAndPasswordOutput> {
		const result = await auth.api.signUpEmail({
			body: {
				name: input.name,
				email: input.email,
				password: input.password,
				image: input.image,
			},
			headers: fromNodeHeaders(input.context.headers),
			returnHeaders: true,
		});

		return {
			user: mapBetterAuthUser(result.response.user),
			responseHeaders: headersToArray(result.headers),
		};
	}

	async signInWithEmailAndPassword(
		input: ISignInWithEmailAndPasswordInput
	): Promise<ISignInWithEmailAndPasswordOutput> {
		const result = await auth.api.signInEmail({
			body: {
				email: input.email,
				password: input.password,
			},
			headers: fromNodeHeaders(input.context.headers),
			returnHeaders: true,
		});

		return {
			user: mapBetterAuthUser(result.response.user),
			responseHeaders: headersToArray(result.headers),
		};
	}

	async getSession(input: IGetSessionInput): Promise<IAuthSession | null> {
		const session = await auth.api.getSession({
			headers: fromNodeHeaders(input.context.headers),
		});

		if (!session) {
			return null;
		}

		return {
			user: mapBetterAuthUser(session.user),
			sessionId: session.session.id,
			expiresAt: session.session.expiresAt,
		};
	}

	async signOut(input: ISignOutInput): Promise<ISignOutOutput> {
		const result = await auth.api.signOut({
			headers: fromNodeHeaders(input.context.headers),
			returnHeaders: true,
		});

		return {
			responseHeaders: headersToArray(result.headers),
		};
	}
}
