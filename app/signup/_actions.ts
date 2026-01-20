"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

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

  // Better Auth uses email field, but we'll use username as email
  await auth.api.signUpEmail({
    body: {
      email: username,
      password: password,
      name: username,
    },
  });

  redirect("/login");
}
