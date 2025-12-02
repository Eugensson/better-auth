import Link from "next/link";

import { LoginForm } from "@/components/login-form";
import { ReturnButton } from "@/components/return-button";
import { SignInOauthButton } from "@/components/sign-in-oauth-button";
import { MagicLinkLoginForm } from "@/components/magic-link-login-form";

const LoginPage = () => {
  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/" label="Home" />
        <h1 className="text-3xl font-bold">Login</h1>
      </div>
      <div className="space-y-4">
        <MagicLinkLoginForm />
        <LoginForm />
        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?&nbsp;
          <Link href="/auth/register" className="hover:text-foreground">
            Register
          </Link>
        </p>
        <hr className="max-w-sm" />
      </div>
      <div className="max-w-sm flex flex-col gap-4">
        <SignInOauthButton provider="google" />
        <SignInOauthButton provider="github" />
      </div>
    </div>
  );
};

export default LoginPage;
