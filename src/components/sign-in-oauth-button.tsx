"use client";

import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

interface SignInOauthButtonProps {
  provider: "google" | "github";
  signUp?: boolean;
}

export const SignInOauthButton = ({
  provider,
  signUp,
}: SignInOauthButtonProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleClick = async (provider: "google" | "github") => {
    await signIn.social({
      provider,
      callbackURL: "/profile",
      errorCallbackURL: "/auth/login/error",
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    });
  };

  const action = signUp ? "Up" : "In";
  const providerName = provider === "google" ? "Google" : "GitHub";

  return (
    <Button
      type="button"
      onClick={() => handleClick(provider)}
      disabled={isPending}
    >
      Sign {action} with {providerName}
    </Button>
  );
};
