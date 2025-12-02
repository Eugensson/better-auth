"use client";

import { toast } from "sonner";
import { Star } from "lucide-react";
import { useRef, useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { signIn } from "@/lib/auth-client";

export const MagicLinkLoginForm = () => {
  const ref = useRef<HTMLDetailsElement>(null);
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const formData = new FormData(evt.target as HTMLFormElement);
    const email = String(formData.get("email"));
    if (!email) return toast.error("Please enter your email.");

    await signIn.magicLink({
      email,
      name: email.split("@")[0],
      callbackURL: "/profile",
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
          toast.success("Check your email for the magic link!");
          (evt.target as HTMLFormElement).reset();
          ref.current?.removeAttribute("open");
        },
      },
    });
  };

  return (
    <details
      ref={ref}
      className="max-w-sm w-full rounded-md border border-purple-600 overflow-hidden"
    >
      <summary className="px-4 py-1.5 flex items-center gap-2 text-white bg-purple-600 hover:bg-purple-600/80 transition cursor-pointer">
        Try Magic Link <Star size={16} />
      </summary>
      <form onSubmit={handleSubmit} className="px-2 py-1">
        <Label htmlFor="email" className="sr-only">
          Email
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
          />
          <Button type="submit" disabled={isPending}>
            Send
          </Button>
        </div>
      </form>
    </details>
  );
};
