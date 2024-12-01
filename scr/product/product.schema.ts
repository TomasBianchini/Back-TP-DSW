import zod from 'zod';
import { ValidationError } from '../shared/utils/errors.js';
import { friendlyMessage } from '../shared/utils/schemas.utils.js';

const productSchema = zod.object({
  name: zod.string().min(5),
  description: zod.string().min(10),
  price: zod.number().min(1),
  stock: zod.number().min(0, { message: 'Stock must be a positive number' }),
  img_url: zod.string(),
  state: zod
    .enum(['Archived', 'Active'])
    .optional()
    .default('Active')
    .refine((value: string) => value === 'Active' || value === 'Archived', {
      message: 'State must be either Active or Archived',
    }),
  category: zod.string(),
  seller: zod.string(),
});
export function validateProduct(data: any) {
  const result = productSchema.safeParse(data);
  if (!result.success) {
    const message = friendlyMessage(result);
    throw new ValidationError(message);
  }
  return result;
}
