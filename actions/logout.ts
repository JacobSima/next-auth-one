"use server";

import { signOut } from "@/auth";

export const logout = async() => {
  // Some server work here before logging out the user
  await signOut();
}