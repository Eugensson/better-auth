"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { signInEmailAction } from "@/actions/sign-in-email.action";
import Link from "next/link";

export const LoginForm = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    setIsPending(true);

    const formData = new FormData(evt.target as HTMLFormElement);

    const { error } = await signInEmailAction(formData);

    if (error) {
      toast.error(error);
      setIsPending(false);
    } else {
      toast.success("Login successful. Good to have you back!");
      router.push("/profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/auth/forgot-password"
            className="text-sm italic text-muted-foreground hover:text-foreground"
          >
            Forgot Password?
          </Link>
        </div>

        <Input id="password" name="password" type="password" />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        Login
      </Button>
    </form>
  );
};
