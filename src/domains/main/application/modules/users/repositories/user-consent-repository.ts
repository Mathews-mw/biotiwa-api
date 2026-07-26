import { UserConsent } from '@/domains/main/models/entities/user-consent';

export interface IFindUniqueParams {
	userId: string;
	termId: string;
}

export interface IUserConsentRepository {
	create(userConsent: UserConsent): Promise<void>;
	createMany(userConsents: UserConsent[]): Promise<void>;
	update(userConsent: UserConsent): Promise<void>;
	delete(userConsent: UserConsent): Promise<void>;
	findById(id: string): Promise<UserConsent | null>;
	findManyByUserId(userId: string): Promise<UserConsent[]>;
	findUnique(params: IFindUniqueParams): Promise<UserConsent | null>;
}
