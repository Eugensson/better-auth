"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { signOut } from "@/lib/auth-client";

export const SignOutButton = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleClick = async () => {
    await signOut({
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
          toast.success("You've logged out. See you soon!");
          router.push("/auth/login");
        },
      },
    });
  };

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={handleClick}
      disabled={isPending}
    >
      Sign out
    </Button>
  );
};
