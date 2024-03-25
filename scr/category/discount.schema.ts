import zod from "zod";

const discountSchema = zod.object({
  value: zod
    .number()
    .min(1, { message: "Value must be a positive number" })
    .max(100, { message: "Value must be less than 100" }),
  state: zod
    .enum(["Archived", "Active"])
    .default("Active")
    .refine((value: string) => value === "Active" || value === "Archived", {
      message: "State must be either Active or Archived",
    }),
  category: zod.string(),
});

export function validateDiscount(data: any) {
  return discountSchema.safeParse(data);
}
