import { ReturnButton } from "@/components/return-button";

interface AuthLoginErrorPageProps {
  searchParams: Promise<{ error: string }>;
}

const AuthLoginErrorPage = async ({
  searchParams,
}: AuthLoginErrorPageProps) => {
  const sp = await searchParams;

  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/auth/login" label="Login" />
        <h1 className="text-3xl font-bold">Login Error</h1>
      </div>
      <p className="text-destructive">
        {sp.error === "account_not_linked"
          ? "This accoun is already linked to another sign-in method."
          : "Opps! Something went wrong. Please try again."}
      </p>
    </div>
  );
};

export default AuthLoginErrorPage;
