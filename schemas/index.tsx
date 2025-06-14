import { UserRole } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  }),
  password: z.string().min(1, {
    message: "Password is required"
  }),
  code: z.optional(z.string())
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  }),
  password: z.string().min(6, {
    message: "Minimum 6 character required"
  }),
  name: z.string().min(6, {
    message: "Name is required"
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  })
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 character required"
  })
});

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  email: z.optional(z.string()),
  password: z.optional(z.string().min(6, {
    message: "Minimum 6 character required"
  })),
  newPassword: z.optional(z.string().min(6, {
    message: "Minimum 6 character required"
  })),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  isTwoFactorEnabled: z.optional(z.boolean()),
})
.refine(data => {
  if(data.password && !data.newPassword) {
    return false;
  }
  return true;
}, {
  message: "New password is required!",
  path: ["newPassword"]
})
.refine(data => {
  if(data.newPassword && !data.password) {
    return false;
  }

  return true;
}, {
  message: "password is required!",
  path: ["password"]
});

