import zod from "zod";
import { categorySchema } from "./category.schema.js";

const discountSchema = zod.object({
  value: zod
    .number()
    .min(1, { message: "Value must be a positive number" })
    .max(100, { message: "Value must be less than 100" }),
  state: zod
    .enum(["Archived", "Active"])
    .default("Active")
    .refine((value) => value === "Active" || value === "Archived", {
      message: "State must be either Active or Archived",
    }),
  category: categorySchema.pick({ category: true }),
});

export function validateDiscount(data: any) {
  return discountSchema.safeParse(data);
}
