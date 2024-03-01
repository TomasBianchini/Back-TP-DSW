import zod from "zod";

const orderSchema = zod.object({
  product: zod.string(),
  quantity: zod.number().min(1),
  state: zod
    .enum(["Complete", "Pending", "Canceled"])
    .default("Pending")
    .refine(
      (value) =>
        value === "Complete" || value === "Pending" || value === "Canceled",
      {
        message: "State must be either Complete, Pending or Canceled",
      }
    ),
});

export function validateOrder(data: any) {
  return orderSchema.safeParse(data);
}
