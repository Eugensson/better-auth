import Link from "next/link";

import { RegisterForm } from "@/components/register-form";
import { ReturnButton } from "@/components/return-button";
import { SignInOauthButton } from "@/components/sign-in-oauth-button";

const RegisterPage = () => {
  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/" label="Home" />
        <h1 className="text-3xl font-bold">Register</h1>
      </div>
      <div className="space-y-4">
        <RegisterForm />
        <p className="text-muted-foreground text-sm">
          Already have an account?&nbsp;
          <Link href="/auth/login" className="hover:text-foreground">
            Login
          </Link>
        </p>
        <hr className="max-w-sm" />
      </div>
      <div className="max-w-sm flex flex-col gap-4">
        <SignInOauthButton provider="google" signUp />
        <SignInOauthButton provider="github" signUp />
      </div>
    </div>
  );
};

export default RegisterPage;
