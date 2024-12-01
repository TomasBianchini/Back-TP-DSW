import zod from 'zod';
import { friendlyMessage } from '../utils/schemas.utils.js';
import { ValidationError } from '../shared/constants/errors.js';

const orderSchema = zod.object({
  subtotal: zod.number(),
  product: zod.union([zod.string(), zod.object({ id: zod.string() })]),
  quantity: zod.number().min(1),
  cart: zod.union([zod.string(), zod.object({ id: zod.string() })]),
});

export function validateOrder(data: any) {
  const result = orderSchema.safeParse(data);
  if (!result.success) {
    const message = friendlyMessage(result);
    throw new ValidationError(message);
  }
  return result;
}
