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

export function validateUser(data: any) {
  return userSchema.safeParse(data);
}
