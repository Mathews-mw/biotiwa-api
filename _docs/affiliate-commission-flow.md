Conceitualmente:

Stripe payment success
        ↓
Payment PAID
        ↓
Order PAID
        ↓
PromotionRedemption REDEEMED
        ↓
OrderPromotion AFFILIATE?
       / \
      no  yes
      │    ↓
      │ AffiliateCommission PENDING
      │
      └── termina

O que testar nessa fase?

- COUPON pago não gera comissão;
- AFFILIATE pago gera exatamente uma AffiliateCommission;
- webhook repetido não gera comissão duplicada;
- comissão utiliza o rate salvo no OrderPromotion, mesmo que a campanha tenha mudado depois;
- commissionBaseAmount = items + orderBump - discounts;
- frete não altera a comissão;
- imposto não altera a comissão;
- desconto de 100% gera comissão 0;
- refund de comissão PENDING resulta em CANCELED;
- refund de pedido sem afiliado continua funcionando normalmente;
- afiliado suspenso depois que o checkout foi criado não altera retroativamente os termos já salvos no pedido.

No final, teremos:

- Checkout afiliado ✅
- Attribution snapshot ✅
- Payment lifecycle ✅
- Commission calculation ✅
- Commission persistence ✅
- Refund cancellation ✅