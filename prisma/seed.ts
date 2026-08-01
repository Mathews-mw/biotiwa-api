import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '@/generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString }, { schema: 'biotiwa' });

const prisma = new PrismaClient({ adapter, log: ['query', 'warn', 'error'] });

async function createOffer(input: {
	marketCode: 'BR' | 'US';
	productId: string;
	name: string;
	slug: string;
	description: string;
	unitAmount: number;
	discountPercent: number;
	isHighlighted: boolean;
	quantity: number;
	sortOrder: number;
}) {
	const offer = await prisma.offer.create({
		data: {
			marketCode: input.marketCode,
			name: input.name,
			description: input.description,
			unitAmount: input.unitAmount,
			slug: input.slug,
			discountPercent: input.discountPercent,
			isHighlighted: input.isHighlighted,
			status: 'ACTIVE',
			sortOrder: input.sortOrder,
			items: {
				create: {
					productId: input.productId,
					quantity: input.quantity,
				},
			},
		},
	});

	return offer;
}

async function createConsentTerms() {
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');

	const consetTermsData: Prisma.ConsentTermUncheckedCreateInput[] = [
		{
			type: 'TERMS_OF_USE',
			version: `${currentYear}-${currentMonth}`,
			title: 'Termos de uso',
			description: 'Termos de uso do site',
		},
		{
			type: 'PRIVACY_POLICY',
			version: `${currentYear}-${currentMonth}`,
			title: 'Política de privacidade',
			description: 'Política de privacidade do site',
		},
		{
			type: 'MARKETING',
			version: `${currentYear}-${currentMonth}`,
			title: 'Marketing',
			description: 'Consentimento para uso de dados de marketing',
		},
	];

	for await (const term of consetTermsData) {
		await prisma.consentTerm.upsert({
			where: { type_version: { type: term.type, version: term.version } },
			update: {},
			create: term,
		});
	}
}

async function main() {
	console.log('Starting db seed...');

	console.log('Deleting existing data...');
	// await prisma.market.deleteMany();

	console.log('Creating consent terms...');
	await createConsentTerms();

	console.log('Creating markets...');
	// await prisma.market.create({
	// 	data: {
	// 		code: 'BR',
	// 		label: 'Brasil',
	// 		locale: 'pt-BR',
	// 		currency: 'BRL',
	// 		shippingAmount: 4000,
	// 		taxRate: new Prisma.Decimal(0.18),
	// 		isActive: true,
	// 	},
	// });

	// await prisma.market.create({
	// 	data: {
	// 		code: 'US',
	// 		label: 'United States',
	// 		locale: 'en-US',
	// 		currency: 'USD',
	// 		shippingAmount: 500,
	// 		taxRate: new Prisma.Decimal(0.0),
	// 		isActive: true,
	// 	},
	// });

	console.log('Creating products...');
	const product = await prisma.product.upsert({
		where: { sku: 'ACAIPULSE-60' },
		update: {},
		create: {
			sku: 'ACAIPULSE-60',
			slug: 'acaipulse',
			name: 'Açaípulse®',
			shortDescription: 'Suplemento natural em cápsulas.',
			description: 'Açaípulse® combina a força da Amazônia com uma experiência premium de suplementação.',
			imageUrl: '/images/product/acaipulse-bottle.png',
			pillsPerPack: 60,
			status: 'ACTIVE',
		},
	});

	console.log('Creating offers...');
	await createOffer({
		marketCode: 'BR',
		productId: product.id,
		slug: 'kit-1-mes',
		name: 'Kit 1 mês',
		description: '1 frasco com 60 cápsulas.',
		unitAmount: 12990,
		discountPercent: 0,
		isHighlighted: false,
		quantity: 1,
		sortOrder: 1,
	});

	await createOffer({
		marketCode: 'BR',
		productId: product.id,
		slug: 'kit-3-meses',
		name: 'Kit 3 meses',
		description: '3 frascos com 10% OFF.',
		unitAmount: 12990,
		discountPercent: 10,
		isHighlighted: true,
		quantity: 3,
		sortOrder: 2,
	});

	await createOffer({
		marketCode: 'US',
		productId: product.id,
		slug: '1-month-kit',
		name: '1-month kit',
		description: '1 bottle with 60 capsules.',
		unitAmount: 4990,
		discountPercent: 0,
		isHighlighted: false,
		quantity: 1,
		sortOrder: 1,
	});

	await createOffer({
		marketCode: 'US',
		productId: product.id,
		slug: '3-month-kit',
		name: '3-month kit',
		description: '3 bottles with 10% OFF.',
		unitAmount: 4990,
		discountPercent: 10,
		isHighlighted: true,
		quantity: 3,
		sortOrder: 2,
	});

	console.log('Creating order bumps...');
	await prisma.orderBump.upsert({
		where: {
			id: 'br-extra-bottle-bump',
		},
		update: {},
		create: {
			id: 'br-extra-bottle-bump',
			marketCode: 'BR',
			productId: product.id,
			name: 'Adicionar frasco extra',
			description: 'Inclua mais 1 frasco ao seu pedido.',
			unitAmount: 9990,
			quantity: 1,
			isActive: true,
			sortOrder: 1,
		},
	});

	await prisma.orderBump.upsert({
		where: {
			id: 'us-extra-bottle-bump',
		},
		update: {},
		create: {
			id: 'us-extra-bottle-bump',
			marketCode: 'US',
			productId: product.id,
			name: 'Add an extra bottle',
			description: 'Add 1 extra bottle to your order.',
			unitAmount: 3990,
			quantity: 1,
			isActive: true,
			sortOrder: 1,
		},
	});

	console.log('Seeding Finished!');
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (error) => {
		console.log('Db seed error: ', error);
		await prisma.$disconnect;
		process.exit(1);
	});
