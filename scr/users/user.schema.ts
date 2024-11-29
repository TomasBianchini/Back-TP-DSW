import zod from 'zod';
import { friendlyMessage } from '../utils/schemas.utils.js';
import { ValidationError } from '../shared/constants/errors.js';

const userSchema = zod.object({
  user_name: zod.string().min(5),
  email: zod.string().email({ message: 'Invalid email address' }),
  password: zod.string().min(8),
  address: zod.string(),
  type: zod.enum(['Admin', 'User', 'Seller']),
  state: zod
    .enum(['Archived', 'Active'])
    .default('Active')
    .refine((value: string) => value === 'Active' || value === 'Archived', {
      message: 'State must be either Active or Archived',
    }),
});

const sellerSchema = userSchema.extend({
  shop_name: zod.string(),
  cuil: zod.string(),
  cbu: zod.string(),
});

export function validateUser(data: any) {
  const result = userSchema.safeParse(data);
  if (!result.success) {
    const message = friendlyMessage(result);
    throw new ValidationError(message);
  }
  return result;
}

export function validateSeller(data: any) {
  const result = sellerSchema.safeParse(data);
  if (!result.success) {
    const message = friendlyMessage(result);
    throw new ValidationError(message);
  }
  return result;
}
