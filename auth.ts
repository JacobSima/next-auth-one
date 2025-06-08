import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
    error: '/autherror',
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      });
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification(Github, Google)
      if (account?.provider !== "credentials") {
        return true;
      }

      const existingUser = await getUserById(user.id);

      // Prevent sign it without email verification
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }

      //Check for 2FA 
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        
        if (!twoFactorConfirmation) {
          return false;
        }

        // Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({ where: { id: twoFactorConfirmation.id } });
      };

      return true;
    },

    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        return token;
      }

      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if(session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      

      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});