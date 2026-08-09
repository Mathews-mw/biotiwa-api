import { z } from 'zod';

import { cartSchema } from './cart-schema';
import { userSchema } from '../user/user-schema';
import { marketSchema } from '../commerce/market-schema';
import { cartItemDetailsSchema } from './cart-item-details-schema';

export const cartDetailsSchema = cartSchema.extend({
	user: userSchema,
	market: marketSchema,
	items: z.array(cartItemDetailsSchema),
});

export type ICartDetailsResponseSchema = z.infer<typeof cartDetailsSchema>;
