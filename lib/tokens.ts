import crypto from "crypto";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/lib/password-reset-token";

const anHour = 3600 * 1000;
const fiveMinute = 5 * 60 * 1000;

export const setExpires = () => new Date(new Date().getTime() + fiveMinute);

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = setExpires(); 

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({ where: { id: existingToken.id } });
  }

  const verification = await db.verificationToken.create({ data: { email, token, expires } });

  return verification;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = setExpires();

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({ where: { id: existingToken.id } });
  }

  const passwordResetToken = await db.passwordResetToken.create({ data: { email, token, expires } });

  return passwordResetToken;
};

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = setExpires(); 

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({ where: { id: existingToken.id } });
  }

  const twoFactorToken = await db.twoFactorToken.create({ data: { email, token, expires } });
  return twoFactorToken;
};