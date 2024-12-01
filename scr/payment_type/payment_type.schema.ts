import zod from 'zod';
import { friendlyMessage } from '../shared/utils/schemas.utils.js';
import { ValidationError } from '../shared/utils/errors.js';

const payment_typeSchema = zod.object({
  payment_type: zod.string().refine((value) => value.trim().length > 0, {
    message: 'Payment type can not be empty or contain only spaces',
  }),
  state: zod
    .enum(['Archived', 'Active'])
    .default('Active')
    .refine((value: string) => value === 'Active' || value === 'Archived', {
      message: 'State must be either Active or Archived',
    }),
});

export function validatePayment_type(data: any) {
  const result = payment_typeSchema.safeParse(data);
  if (!result.success) {
    const message = friendlyMessage(result);
    throw new ValidationError(message);
  }
  return result;
}
