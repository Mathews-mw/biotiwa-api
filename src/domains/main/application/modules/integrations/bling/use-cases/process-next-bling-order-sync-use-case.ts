import { inject, injectable } from 'tsyringe';

import { failure, success, type Outcome } from '@/core/outcome';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import type { IBlingGateway } from '@/services/bling/repositories/bling-gateway';
import type { IOrderRepository } from '../../../orders/repositories/order-repository';
import type { IBlingOrderSyncRepository } from '../repositories/bling-order-sync-repository';
import type { IBlingAuthentication } from '@/services/bling/repositories/bling-authentication';

import { onlyDigits } from '@/utils/only-digits';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { isDuplicatedBlingContactError } from '@/services/bling/errors/is-duplicated-bling-contact-error';

type Response = Outcome<
	ResourceNotFoundError | BadRequestError,
	{
		processed: boolean;
		syncId?: string;
		orderId?: string;
		blingContactId?: string | null;
		blingOrderId?: string | null;
		status?: string;
		reason?: string;
	}
>;

@injectable()
export class ProcessNextBlingOrderSyncUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.BLING_ORDER_SYNC_REPOSITORY)
		private readonly blingOrderSyncRepository: IBlingOrderSyncRepository,
		@inject(DEPENDENCY_IDENTIFIERS.ORDER_REPOSITORY)
		private readonly orderRepository: IOrderRepository,
		@inject(DEPENDENCY_IDENTIFIERS.BLING_GATEWAY_SERVICE)
		private readonly blingGateway: IBlingGateway,
		@inject(DEPENDENCY_IDENTIFIERS.BLING_AUTHENTICATION)
		private blingAuthentication: IBlingAuthentication
	) {}

	async execute(): Promise<Response> {
		const sync = await this.blingOrderSyncRepository.claimNextPendingOrFailed();

		if (!sync) {
			return success({
				processed: false,
				reason: 'NO_PENDING_BLING_ORDER_SYNC',
			});
		}

		try {
			const orderDetails = await this.orderRepository.findById(sync.orderId.toString());

			if (!orderDetails) {
				throw new ResourceNotFoundError('Order not found for Bling sync', 'ORDER_NOT_FOUND');
			}

			if (orderDetails.status !== 'PAID') {
				throw new BadRequestError('Only paid orders can be synchronized with Bling', 'BLING_SYNC_ORDER_NOT_PAID');
			}

			if (!orderDetails.orderCustomer) {
				throw new BadRequestError('Order customer snapshot not found', 'ORDER_CUSTOMER_SNAPSHOT_NOT_FOUND');
			}

			if (!orderDetails.orderShippingAddress) {
				throw new BadRequestError(
					'Order shipping address snapshot not found',
					'ORDER_SHIPPING_ADDRESS_SNAPSHOT_NOT_FOUND'
				);
			}

			const tokenResult = await this.blingAuthentication.getValidBlingAccessToken({ forceRefresh: true });

			const accessToken = tokenResult.accessToken;

			const blingContactId = await this.getOrCreateBlingContactAndPersist({
				accessToken,
				sync,
				orderDetails,
			});

			const items = await this.resolveBlingOrderItems({
				accessToken,
				orderItems: orderDetails.items,
			});

			const salesOrderInput = {
				accessToken,
				contact: {
					id: Number(blingContactId),
					name: orderDetails.orderCustomer.name,
					document: orderDetails.orderCustomer.document,
					personType: getPersonTypeFromDocument(orderDetails.orderCustomer.document),
				},
				items,
				shippingAmount: orderDetails.shippingAmount,
				discountAmount: orderDetails.discountAmount,
				externalOrderId: orderDetails.id.toString(),
				notes: `Pedido Biotiwa ${orderDetails.id.toString()}`,
				orderDate: orderDetails.createdAt,
			};

			const salesOrder = await this.blingGateway.createSalesOrder(salesOrderInput);

			sync.markAsSynced({
				blingContactId,
				blingOrderId: salesOrder.id,
				requestPayload: removeSensitiveDataFromSalesOrderInput(salesOrderInput),
				responsePayload: salesOrder.rawPayload,
			});

			const synced = await this.blingOrderSyncRepository.save(sync);

			orderDetails.order.markAsProcessing();

			await this.orderRepository.save(orderDetails.order);

			return success({
				processed: true,
				syncId: synced.id.toString(),
				orderId: synced.orderId.toString(),
				blingContactId: synced.blingContactId,
				blingOrderId: synced.blingOrderId,
				status: synced.status,
			});
		} catch (error) {
			sync.markAsFailed({
				errorMessage: getErrorMessage(error),
			});

			await this.blingOrderSyncRepository.save(sync);

			if (error instanceof ResourceNotFoundError || error instanceof BadRequestError) {
				return failure(error);
			}

			return failure(new BadRequestError(getErrorMessage(error), 'BLING_ORDER_SYNC_FAILED'));
		}
	}

	private async getOrCreateBlingContactAndPersist(input: {
		accessToken: string;
		sync: Awaited<ReturnType<IBlingOrderSyncRepository['claimNextPendingOrFailed']>>;
		orderDetails: NonNullable<Awaited<ReturnType<IOrderRepository['findById']>>>;
	}) {
		const { accessToken, sync, orderDetails } = input;

		if (!sync) {
			throw new BadRequestError('Bling sync was not claimed', 'BLING_ORDER_SYNC_NOT_CLAIMED');
		}

		const customer = orderDetails.orderCustomer;
		const shippingAddress = orderDetails.orderShippingAddress;

		if (!customer || !shippingAddress) {
			throw new BadRequestError('Order snapshot is incomplete', 'ORDER_SNAPSHOT_INCOMPLETE');
		}

		const existingContact = customer.document
			? await this.blingGateway.findContactByDocument({
					accessToken,
					document: customer.document,
				})
			: null;

		if (existingContact) {
			sync.setBlingContactId(existingContact.id);

			await this.blingOrderSyncRepository.save(sync);

			return String(existingContact.id);
		}

		try {
			const createdContact = await this.blingGateway.createContact({
				accessToken,
				name: customer.name,
				email: customer.email,
				phone: customer.phone,
				document: customer.document,
				personType: getPersonTypeFromDocument(customer.document),
				address: {
					zipCode: shippingAddress.zipCode,
					street: shippingAddress.street,
					number: shippingAddress.number,
					complement: shippingAddress.complement,
					district: shippingAddress.district,
					city: shippingAddress.city,
					state: shippingAddress.state,
				},
			});

			sync.setBlingContactId(createdContact.id);

			await this.blingOrderSyncRepository.save(sync);

			return String(createdContact.id);
		} catch (error) {
			if (!isDuplicatedBlingContactError(error)) {
				throw error;
			}

			const duplicatedContact = await this.findExistingContactByDocument({
				accessToken,
				document: customer.document,
			});

			if (!duplicatedContact) {
				throw new BadRequestError(
					'Bling reported duplicated contact, but the contact could not be found by document',
					'BLING_DUPLICATED_CONTACT_NOT_FOUND'
				);
			}

			sync.setBlingContactId(duplicatedContact.id);

			await this.blingOrderSyncRepository.save(sync);

			return String(duplicatedContact.id);
		}
	}

	private async findExistingContactByDocument(input: { accessToken: string; document?: string | null }) {
		if (!input.document) {
			return null;
		}

		const document = onlyDigits(input.document);

		if (!document) {
			return null;
		}

		return this.blingGateway.findContactByDocument({
			accessToken: input.accessToken,
			document,
		});
	}

	private async resolveBlingOrderItems(input: {
		accessToken: string;
		orderItems: NonNullable<Awaited<ReturnType<IOrderRepository['findById']>>>['items'];
	}) {
		const productCache = new Map<string, number>();

		const items = [];

		for (const item of input.orderItems) {
			let blingProductId = productCache.get(item.sku);

			if (!blingProductId) {
				const product = await this.blingGateway.findProductBySku({
					accessToken: input.accessToken,
					sku: item.sku,
				});

				if (!product) {
					throw new BadRequestError(`Bling product not found for SKU ${item.sku}`, 'BLING_PRODUCT_NOT_FOUND');
				}

				blingProductId = product.id;

				productCache.set(item.sku, blingProductId);
			}

			items.push({
				sku: item.sku,
				name: item.name,
				quantity: item.quantity,
				unitAmount: item.unitAmount,
				blingProductId,
			});
		}

		return items;
	}
}

function getPersonTypeFromDocument(document?: string | null): 'F' | 'J' | 'E' {
	if (!document) {
		return 'F';
	}

	const digits = document.replace(/\D/g, '');

	if (digits.length === 14) {
		return 'J';
	}

	return 'F';
}

function getErrorMessage(error: unknown) {
	if (error instanceof Error) {
		return error.message;
	}

	return 'Unknown Bling order sync error';
}

function removeSensitiveDataFromSalesOrderInput(input: { accessToken: string; [key: string]: unknown }) {
	const { accessToken: _accessToken, ...safeInput } = input;

	void _accessToken; // This line is just to avoid unused variable warning

	return safeInput;
}
