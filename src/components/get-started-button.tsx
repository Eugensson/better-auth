"use client";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";

import { useSession } from "@/lib/auth-client";

export const GetStartedButton = () => {
  const { data: session, isPending } = useSession();

  if (isPending)
    return (
      <Button size="lg" className="opacity-50">
        Get Started
      </Button>
    );

  const href = session ? "/profile" : "/auth/login";

  return (
    <div className="flex flex-col items-center gap-4">
      <Link href={href} className={buttonVariants({ size: "lg" })}>
        Get Started
      </Link>
      {session && (
        <p className="flex items-center gap-2">
          <span
            data-role={session.user.role}
            className="size-4 rounded-full animate-pulse data-[role=USER]:bg-blue-600 data-[role=ADMIN]:bg-red-600"
          />
          Welcome back, {session.user.name}!👋
        </p>
      )}
    </div>
  );
};
