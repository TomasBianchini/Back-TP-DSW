import zod from 'zod';
import { friendlyMessage } from '../utils/schemas.utils.js';
import { ValidationError } from '../shared/constants/errors.js';

const cartSchema = zod.object({
  user: zod.string().optional(),
  state: zod
    .enum(['Completed', 'Pending', 'Canceled'])
    .optional()
    .default('Pending')
    .refine(
      (value: string) =>
        value === 'Completed' || value === 'Pending' || value === 'Canceled',
      { message: 'State must be either Complete, Pending or Canceled' }
    ),
  total: zod
    .number()
    .nonnegative({ message: 'Total must be a positive number' })
    .optional()
    .default(0),
  shipmethod: zod.string().optional(),
  payment_type: zod.string().optional(),
});

export function validateCart(data: any) {
  const result = cartSchema.safeParse(data);
  if (!result.success) {
    const message = friendlyMessage(result);
    throw new ValidationError(message);
  }
  return result;
}
