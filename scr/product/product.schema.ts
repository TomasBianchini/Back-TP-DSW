import zod from "zod";

const productSchema = zod.object({
  name: zod.string().min(5),
  description: zod.string().min(10),
  price: zod.number().min(1),
  stock: zod.number().min(0, { message: "Stock must be a positive number" }),
  state: zod
    .enum(["Archived", "Active"])
    .default("Active")
    .refine((value) => value === "Active" || value === "Archived", {
      message: "State must be either Active or Archived",
    }),
  category: zod.string(),
  seller: zod.string(),
});
export function validateProduct(data: any) {
  return productSchema.safeParse(data);
}
