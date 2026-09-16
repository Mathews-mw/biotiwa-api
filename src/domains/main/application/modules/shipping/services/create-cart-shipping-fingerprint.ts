import crypto from 'node:crypto';

interface ICreateCartShippingFingerprintInput {
	cartId: string;
	items: Array<{
		id: string;
		type: string;
		quantity: number;
		offerId?: string | null;
		orderBumpId?: string | null;
	}>;
}

export function createCartShippingFingerprint(input: ICreateCartShippingFingerprintInput) {
	const normalizedItems = input.items
		.map((item) => ({
			id: item.id,
			type: item.type,
			quantity: item.quantity,

			offerId: item.offerId ?? null,

			orderBumpId: item.orderBumpId ?? null,
		}))
		.sort((a, b) => a.id.localeCompare(b.id));

	const payload = JSON.stringify({
		cartId: input.cartId,
		items: normalizedItems,
	});

	return crypto.createHash('sha256').update(payload).digest('hex');
}
