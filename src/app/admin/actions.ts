"use server";

import { AuthError } from "@auth/core/errors";

import { signIn, signOut } from "@/auth";

export interface LoginState {
  error: string | null;
}

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { error: "Enter your email and password." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin/leads",
    });
    return { error: null };
  } catch (error: unknown) {
    if (
      error instanceof AuthError ||
      (typeof error === "object" &&
        error !== null &&
        "type" in error &&
        error.type === "CredentialsSignin")
    ) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/admin/login" });
}
