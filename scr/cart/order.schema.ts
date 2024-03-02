import zod from "zod";

const orderSchema = zod.object({
  subtotal: zod.number().min(1),
  product: zod.string(),
  quantity: zod.number().min(1),
});

export function validateOrder(data: any) {
  return orderSchema.safeParse(data);
}
