import zod from "zod";

const cartSchema = zod.object({
  user: zod.string(),
  state: zod
    .enum(["Complete", "Pending", "Canceled"])
    .optional()
    .default("Pending")
    .refine(
      (value) =>
        value === "Complete" || value === "Pending" || value === "Canceled",
      { message: "State must be either Complete, Pending or Canceled" }
    ),
  total: zod.number().min(0, { message: "Total must be a positive number" }),
  shipmethod: zod
    .enum(["Standard", "Express", "Next Day", "Pickup"])
    .optional()
    .default("Standard")
    .refine(
      (value) =>
        value === "Standard" ||
        value === "Express" ||
        value === "Next Day" ||
        value === "Pickup",
      {
        message:
          "Shipmethod must be either Standard, Express, Next Day or Pickup",
      }
    ),
});

export function validateCart(data: any) {
  return cartSchema.safeParse(data);
}
