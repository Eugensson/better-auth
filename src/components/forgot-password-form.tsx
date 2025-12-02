"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "@/lib/auth-client";

export const ForgotPasswordForm = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const formData = new FormData(evt.currentTarget);
    const email = String(formData.get("email"));

    if (!email) return toast.error("Please enter your email.");

    await requestPasswordReset({
      email,
      redirectTo: "/auth/reset-password",
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
        onSuccess: () => {
          toast.success("Reset link sent to your email.");
          router.push("/auth/forgot-password/success");
        },
      },
    });
  };

  return (
    <form className="max-w-sm w-full space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" />
      </div>

      <Button type="submit" disabled={isPending}>
        Send Reset Link
      </Button>
    </form>
  );
};
