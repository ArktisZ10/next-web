"use server";

import { createUser } from "@/db/collections/User";
import { redirect } from "next/navigation";

export async function signupAction(formData: FormData) {
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!username || !password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long" };
  }

  try {
    await createUser(username, password);
    redirect("/login");
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An error occurred during signup" };
  }
}
