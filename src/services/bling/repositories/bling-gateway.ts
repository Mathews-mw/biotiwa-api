/**
 * F = Física
 *
 * J = Jurídica
 *
 * E = Estrangeira
 */
export type IBlingContactPersonType = 'F' | 'J' | 'E';

/**
 * A Ativo
 *
 * E Excluído
 *
 * I Inativo
 *
 * S Sem movimentação
 */
export type IBlingContactSituation = 'A' | 'E' | 'I' | 'S';

export type ICreateBlingContactInput = {
	accessToken: string;
	name: string;
	email?: string | null;
	phone?: string | null;
	document?: string | null;
	situation?: IBlingContactSituation;
	personType?: IBlingContactPersonType;
	address?: {
		zipCode?: string | null;
		street?: string | null;
		number?: string | null;
		complement?: string | null;
		district?: string | null;
		city?: string | null;
		state?: string | null;
	} | null;
};

export type ICreateBlingContactOutput = {
	id: number;
	rawPayload: unknown;
};

export type ICreateBlingSalesOrderInput = {
	accessToken: string;
	contact: {
		id: number;
		name: string;
		document?: string | null;
		personType?: IBlingContactPersonType;
	};
	items: Array<{
		sku: string;
		name: string;
		quantity: number;
		unitAmount: number; // centavos
		discountAmount?: number; // centavos
		blingProductId?: number | null;
	}>;
	shippingAmount?: number; // centavos
	discountAmount?: number; // centavos
	notes?: string | null;
	externalOrderId: string;
	orderDate?: Date;
};

export type ICreateBlingSalesOrderOutput = {
	id: number;
	rawPayload: unknown;
};

export type IFindBlingProductBySkuInput = {
	accessToken: string;
	sku: string;
};

export interface IBlingProduct {
	id: number;
	nome: string;
	codigo: string;
	preco: number;
	precoCusto: number;
	tipo: string;
	situacao: string;
	formato: string;
	descricaoCurta: string;
	imagemURL: string;
}

export type IFindBlingProductBySkuOutput = {
	data: Array<{
		id: number;
		nome: string;
		codigo: string;
		preco: number;
		precoCusto: number;
		tipo: string;
		situacao: string;
		formato: string;
		descricaoCurta: string;
		imagemURL: string;
	}>;
};

export type IFindBlingContactByDocumentInput = {
	accessToken: string;
	document: string;
};

export interface IBlingContato {
	id: number;
	nome: string;
	codigo?: string;
	situacao: string;
	numeroDocumento?: string;
	telefone?: string;
	celular?: string;
}

export type IFindBlingContactByDocumentOutput = {
	data: Array<IBlingContato>;
};

export interface IBlingGateway {
	createContact(input: ICreateBlingContactInput): Promise<ICreateBlingContactOutput>;
	createSalesOrder(input: ICreateBlingSalesOrderInput): Promise<ICreateBlingSalesOrderOutput>;
	findProductBySku(input: IFindBlingProductBySkuInput): Promise<IBlingProduct | null>;
	findContactByDocument(input: IFindBlingContactByDocumentInput): Promise<IBlingContato | null>;
}
