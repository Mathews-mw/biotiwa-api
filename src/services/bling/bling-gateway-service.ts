import type {
	IBlingGateway,
	ICreateBlingSalesOrderInput,
	ICreateBlingSalesOrderOutput,
	ICreateBlingContactInput,
	ICreateBlingContactOutput,
	IFindBlingProductBySkuInput,
	IFindBlingProductBySkuOutput,
	IBlingProduct,
} from './repositories/bling-gateway';

import { BlingHelpers } from './bling-helpers';
import { onlyDigits } from '@/utils/only-digits';
import { formatDate } from '@/utils/format-date';
import { centsToDecimal } from '@/utils/cents-to-decimal';
import { removeEmptyValues } from '@/utils/remove-empty-values';
import { BlingGatewayError } from './errors/bling-gateway-error';

type BlingCreateContactResponse = {
	data?: {
		id?: number;
	};
};

export class BlingGatewayService extends BlingHelpers implements IBlingGateway {
	async createContact(input: ICreateBlingContactInput): Promise<ICreateBlingContactOutput> {
		const payload = this.mapCreateContactPayload(input);

		const response = await this.request<BlingCreateContactResponse>({
			accessToken: input.accessToken,
			path: '/contatos',
			method: 'POST',
			body: payload,
		});

		const contactId = response.data?.id;

		if (!contactId) {
			throw new BlingGatewayError('Bling contact was created without returning an id.', 200, response);
		}

		return {
			id: contactId,
			rawPayload: response,
		};
	}

	async createSalesOrder(input: ICreateBlingSalesOrderInput): Promise<ICreateBlingSalesOrderOutput> {
		const payload = this.mapCreateSalesOrderPayload(input);

		console.dir(
			{
				blingSalesOrderPayload: payload,
			},
			{
				depth: null,
			}
		);

		const response = await this.request<{
			data?: {
				id?: number;
			};
		}>({
			accessToken: input.accessToken,
			path: '/pedidos/vendas',
			method: 'POST',
			body: payload,
		});

		const salesOrderId = response.data?.id;

		if (!salesOrderId) {
			throw new BlingGatewayError('Bling sales order was created without returning an id.', 200, response);
		}

		return {
			id: salesOrderId,
			rawPayload: response,
		};
	}

	private mapCreateContactPayload(input: ICreateBlingContactInput) {
		const document = onlyDigits(input.document);
		const phone = onlyDigits(input.phone);
		const zipCode = onlyDigits(input.address?.zipCode);

		return removeEmptyValues({
			nome: input.name,
			tipo: input.personType ?? 'F',
			situacao: 'A',
			numeroDocumento: document,
			telefone: phone,
			email: input.email ?? undefined,
			endereco: removeEmptyValues({
				geral: removeEmptyValues({
					cep: zipCode,
					endereco: input.address?.street ?? undefined,
					numero: input.address?.number ?? undefined,
					complemento: input.address?.complement ?? undefined,
					bairro: input.address?.district ?? undefined,
					municipio: input.address?.city ?? undefined,
					uf: input.address?.state ?? undefined,
				}),
			}),
		});
	}

	private mapCreateSalesOrderPayload(input: ICreateBlingSalesOrderInput) {
		return removeEmptyValues({
			data: formatDate(input.orderDate ?? new Date()),
			contato: removeEmptyValues({
				id: input.contact.id,
				nome: input.contact.name,
				tipoPessoa: input.contact.personType ?? 'F',
				numeroDocumento: onlyDigits(input.contact.document),
			}),
			itens: input.items.map((item) =>
				removeEmptyValues({
					codigo: item.sku,
					descricao: item.name,
					unidade: 'UN',
					quantidade: item.quantity,
					valor: centsToDecimal(item.unitAmount),
					desconto: item.discountAmount ? centsToDecimal(item.discountAmount) : undefined,
					produto: item.blingProductId
						? {
								id: item.blingProductId,
							}
						: undefined,
				})
			),
			desconto: input.discountAmount ? centsToDecimal(input.discountAmount) : undefined,
			transporte: removeEmptyValues({
				frete: input.shippingAmount ? centsToDecimal(input.shippingAmount) : undefined,
			}),
			observacoes: input.notes ?? undefined,
			observacoesInternas: `Pedido origem Biotiwa: ${input.externalOrderId}`,
		});
	}

	async findProductBySku(input: IFindBlingProductBySkuInput): Promise<IBlingProduct | null> {
		const response = await this.request<IFindBlingProductBySkuOutput>({
			accessToken: input.accessToken,
			path: `/produtos?codigos[]=${encodeURIComponent(input.sku)}`,
			method: 'GET',
		});

		const product = response.data?.find((item) => {
			return item.codigo === input.sku;
		});

		if (!product) {
			return null;
		}

		return product;
	}
}
