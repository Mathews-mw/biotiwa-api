import { Payment } from '@/domains/main/models/entities/payment';

export interface IPaymentRepository {
	create(payment: Payment): Promise<Payment>;
	save(payment: Payment): Promise<Payment>;
	findByProviderSessionId(providerSessionId: string): Promise<Payment | null>;
	findByOrderId(orderId: string): Promise<Payment | null>;
	findPendingByOrderId(orderId: string): Promise<Payment | null>;
}
