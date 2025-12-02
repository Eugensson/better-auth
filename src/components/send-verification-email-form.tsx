"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { sendVerificationEmail } from "@/lib/auth-client";

export const SendVerificationEmailForm = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const formData = new FormData(evt.currentTarget as HTMLFormElement);
    const email = String(formData.get("email"));

    if (!email) return toast.error("Please enter your email address.");

    await sendVerificationEmail({
      email,
      callbackURL: "/auth/verify",
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
          toast.success("Verification email sent successfully.");
          router.push("/auth/verify/success");
        },
      },
    });
  };

  return (
    <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" />
      </div>
      <Button type="submit" disabled={isPending}>
        Resend Verification Email
      </Button>
    </form>
  );
};
