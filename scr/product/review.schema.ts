import zod from "zod";

const reviewSchema = zod.object({
  product: zod.string(),
  comment: zod.string().max(200),
  rating: zod.number().min(1).max(5),
  state: zod
    .enum(["Archived", "Active"])
    .default("Active")
    .refine((value) => value === "Active" || value === "Archived", {
      message: "State must be either Active or Archived",
    }),
});

export function validateReview(data: any) {
  return reviewSchema.safeParse(data);
}
