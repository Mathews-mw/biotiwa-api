O fluxo será:

active cart
   ↓
calculateCartSummary
   ↓
resolve shipping
   ↓
resolve promotion novamente
   ↓
calculate promotion discount
   ↓
calculateCheckoutSummary
   ↓
criar Order
   ↓
OrderPromotion snapshot
   ↓
PromotionRedemption PENDING
   ↓
Stripe Checkout Session