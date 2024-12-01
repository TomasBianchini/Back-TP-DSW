import zod from 'zod';
import { friendlyMessage } from '../shared/utils/schemas.utils.js';
import { ValidationError } from '../shared/utils/errors.js';

const shippingSchema = zod.object({
  shipmethod: zod.string().refine((value) => value.trim().length > 0, {
    message: 'Payment type can not be empty or contain only spaces',
  }),
  price: zod.number().min(0, { message: 'Price must be a positive number' }),
  state: zod
    .enum(['Archived', 'Active'])
    .default('Active')
    .refine((value: string) => value === 'Active' || value === 'Archived', {
      message: 'State must be either Active or Archived',
    }),
  estimatedTime: zod.number(),
  cancellationDeadline: zod.number(),
});

export function validateShipping(data: any) {
  const result = shippingSchema.safeParse(data);
  if (!result.success) {
    const message = friendlyMessage(result);
    throw new ValidationError(message);
  }
  return result;
}
