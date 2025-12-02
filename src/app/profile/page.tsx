import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import { ReturnButton } from "@/components/return-button";
import { SignOutButton } from "@/components/sign-out-button";

import { auth } from "@/lib/auth";
import { UserRole } from "@/generated/prisma/enums";
import { UpdateUserForm } from "@/components/update-user-form";
import { ChangePasswordForm } from "@/components/change-password-form";

const ProfilePage = async () => {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) redirect("/auth/login");

  const FULL_POST_ACCESS = await auth.api.userHasPermission({
    headers: headersList,
    body: {
      permissions: {
        posts: ["update", "delete"],
      },
    },
  });

  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/" label="Home" />
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>
      <div className="flex items-center gap-2">
        {session.user.role === UserRole.ADMIN && (
          <Link href="/admin/dashboard" className={buttonVariants()}>
            Admin Dashboard
          </Link>
        )}
        <SignOutButton />
      </div>

      <div className="text-2xl font-bold">Permissions</div>
      <div className="space-x-4">
        <Button size="sm" className="uppercase">
          Manage own posts
        </Button>
        <Button
          size="sm"
          className="uppercase"
          disabled={!FULL_POST_ACCESS.success}
        >
          Manage all posts
        </Button>
      </div>

      {session.user.image ? (
        <Image
          src={session.user.image}
          alt="User profile image"
          width={112}
          height={112}
          className="border border-primary object-cover rounded-md"
        />
      ) : (
        <div className="size-28 flex items-center justify-center border border-primary bg-primary rounded-md text-primary-foreground">
          <span className="text-lg font-bold uppercase">
            {session.user.name.slice(0, 2)}
          </span>
        </div>
      )}

      <pre className="text-sm overflow-clip">
        {JSON.stringify(session, null, 2)}
      </pre>

      <div className="p-4 space-y-4 rounded-b-md border border-t-8 border-blue-600">
        <h2 className="text-2xl font-bold">Update User</h2>
        <UpdateUserForm
          name={session.user.name}
          image={session.user.image ?? ""}
        />
      </div>

      <div className="p-4 space-y-4 rounded-b-md border border-t-8 border-red-600">
        <h2 className="text-2xl font-bold">Change Password</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ProfilePage;
