import zod from "zod";

const categorySchema = zod.object({
  category: zod
    .string()
    .min(5, { message: "Category name must be at least 5 characters long" })
    .refine((value) => value.trim().length > 0, {
      message: "category can not be empty or contain only spaces",
    }),
  state: zod
    .enum(["Archived", "Active"])
    .optional()
    .default("Active")
    .refine((value) => value === "Active" || value === "Archived", {
      message: "State must be either Active or Archived",
    }),
});

export function validateCategory(data: any) {
  return categorySchema.safeParse(data);
}
