"use server";

import { createUser } from "@/db/collections/User";
import { redirect } from "next/navigation";

export async function signupAction(formData: FormData): Promise<void> {
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!username || !password || !confirmPassword) {
    throw new Error("All fields are required");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  await createUser(username, password);
  redirect("/login");
}
