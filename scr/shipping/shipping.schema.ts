import zod from "zod";

const shippingSchema = zod.object({
  shipmethod: zod.string().refine((value) => value.trim().length > 0, {
    message: "Payment type can not be empty or contain only spaces",
  }),
  price: zod.number().min(0, { message: "Price must be a positive number" }),
  state: zod
    .enum(["Archived", "Active"])
    .default("Active")
    .refine((value) => value === "Active" || value === "Archived", {
      message: "State must be either Active or Archived",
    }),
});

export function validateShipping(data: any) {
  return shippingSchema.safeParse(data);
}
