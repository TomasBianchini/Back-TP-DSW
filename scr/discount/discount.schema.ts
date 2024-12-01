import zod from 'zod';
import { ValidationError } from '../shared/utils/errors.js';
import { friendlyMessage } from '../shared/utils/schemas.utils.js';
const discountSchema = zod.object({
  value: zod
    .number()
    .min(1, { message: 'Value must be a positive number' })
    .max(100, { message: 'Value must be less than 100' }),
  state: zod
    .enum(['Archived', 'Active'])
    .default('Active')
    .refine((value: string) => value === 'Active' || value === 'Archived', {
      message: 'State must be either Active or Archived',
    }),
  category: zod.string().optional(),
});

export function validateDiscount(data: any) {
  const result = discountSchema.safeParse(data);
  if (!result.success) {
    const message = friendlyMessage(result);
    throw new ValidationError(message);
  }
  return result;
}
