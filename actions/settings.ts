"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const validatedFields = SettingsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorised" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorised" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    // return if trying to update email but the email is already used by another user
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    // create new token to verify the email
    const verificationToken = await generateVerificationToken(values.email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "Verification email sent!" };
  }


  if (values.password && values.newPassword && dbUser.password) {
    // check if they have entered the correct password, before updating the password
    const passwordMatch = await bcrypt.compare(values.password, dbUser.password);

    if(!passwordMatch) {
      return {error: "Incorrect password!"};
    }

    // hash the new password
    const hashedPassword = await bcrypt.hash(values.password, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;  // We dnt have this values in the db
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: { ...values }
  });

  return { success: "Settings Updated!" };
}

