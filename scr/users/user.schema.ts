import zod from "zod";

const userSchema = zod.object({
  user_name: zod.string().min(5),
  email: zod.string().email({ message: "Invalid email address" }),
  password: zod.string().min(8),
  address: zod.string(),
  type: zod.enum(["Admin", "User", "Seller"]),
  state: zod
    .enum(["Archived", "Active"])
    .default("Active")
    .refine((value) => value === "Active" || value === "Archived", {
      message: "State must be either Active or Archived",
    }),
});

const sellerSchema = userSchema.extend({
  shop_name: zod.string(),
  cuil: zod.string(),
  cbu: zod.string(),
});

export function validateUser(data: any) {
  return userSchema.safeParse(data);
}

export function validateSeller(data: any) {
  return sellerSchema.safeParse(data);
}
