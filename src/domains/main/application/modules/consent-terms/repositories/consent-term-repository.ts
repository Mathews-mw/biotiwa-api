import { ConsentTerm, IConsentType } from '@/domains/main/models/entities/consent-term';

export interface IParams {
	type: IConsentType;
	version: string;
}

export interface IConsentTermRepository {
	create(consentTerm: ConsentTerm): Promise<void>;
	update(consentTerm: ConsentTerm): Promise<void>;
	delete(consentTerm: ConsentTerm): Promise<void>;
	findById(id: string): Promise<ConsentTerm | null>;
	findUnique(params: IParams): Promise<ConsentTerm | null>;
}
