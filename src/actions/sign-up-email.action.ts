"use server";

import { APIError } from "better-auth/api";

import { auth, ErrorCode } from "@/lib/auth";

export const signUpEmailAction = async (formData: FormData) => {
  const name = String(formData.get("name"));
  if (!name) return { error: "Please enter your name" };

  const email = String(formData.get("email"));
  if (!email) return { error: "Please enter your email" };

  const password = String(formData.get("password"));
  if (!password) return { error: "Please enter your password" };

  try {
    await auth.api.signUpEmail({
      body: { name, email, password },
    });

    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      const errCode = err.body ? (err.body.code as ErrorCode) : "UNKNOWN";

      switch (errCode) {
        default:
          return { error: err.message };
      }
    }
    return { error: "Internal server error" };
  }
};
