import { redirect } from "next/navigation";

import { ReturnButton } from "@/components/return-button";
import { SendVerificationEmailForm } from "@/components/send-verification-email-form";

interface AuthVerifyErrorPageProps {
  searchParams: Promise<{ error: string }>;
}

const AuthVerifyErrorPage = async ({
  searchParams,
}: AuthVerifyErrorPageProps) => {
  const { error } = await searchParams;

  if (!error) redirect("/profile");

  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/auth/login" label="Login" />
        <h1 className="text-3xl font-bold">Verify Email</h1>
      </div>
      <p className="text-destructive">
        <span className="capitalize">
          {error.replace(/_/g, " ").replace(/-/g, " ")}
        </span>{" "}
        - Please request a new verification email.
      </p>
      <SendVerificationEmailForm />
    </div>
  );
};

export default AuthVerifyErrorPage;
