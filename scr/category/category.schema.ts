import zod from 'zod';
import { ValidationError } from '../shared/utils/errors.js';
import { friendlyMessage } from '../shared/utils/schemas.utils.js';
const categorySchema = zod.object({
  category: zod
    .string()
    .min(5, { message: 'Category name must be at least 5 characters long' })
    .refine((value) => value.trim().length > 0, {
      message: 'category can not be empty or contain only spaces',
    }),
  state: zod
    .enum(['Archived', 'Active'])
    .optional()
    .default('Active')
    .refine((value: string) => value === 'Active' || value === 'Archived', {
      message: 'State must be either Active or Archived',
    }),
});

export function validateCategory(data: any) {
  const result = categorySchema.safeParse(data);
  if (!result.success) {
    const message = friendlyMessage(result);
    throw new ValidationError(message);
  }
  return result;
}
