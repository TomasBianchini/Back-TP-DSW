import zod from 'zod';
import { friendlyMessage } from '../utils/schemas.utils.js';
import { ValidationError } from '../shared/constants/errors.js';

const reviewSchema = zod.object({
  product: zod.string(),
  comment: zod.string().max(2000),
  rating: zod.number().min(1).max(5),
  state: zod
    .enum(['Archived', 'Active'])
    .default('Active')
    .refine((value: string) => value === 'Active' || value === 'Archived', {
      message: 'State must be either Active or Archived',
    }),
});

export function validateReview(data: any) {
  const result = reviewSchema.safeParse(data);
  if (!result.success) {
    const message = friendlyMessage(result);
    throw new ValidationError(message);
  }
  return result;
}
