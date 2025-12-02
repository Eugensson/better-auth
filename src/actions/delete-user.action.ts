"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { UserRole } from "@/generated/prisma/enums";

export const deleteUserAction = async ({ userId }: { userId: string }) => {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) throw new Error("Unauthorized");

  if (session.user.role !== UserRole.ADMIN) throw new Error("Forbidden");

  try {
    await prisma.user.delete({
      where: {
        id: userId,
        role: UserRole.USER,
      },
    });

    if (session.user.id === userId) {
      await auth.api.signOut({
        headers: headersList,
      });
      redirect("/auth/login");
    }

    revalidatePath("/admin/dashboard");
    return { error: null };
  } catch (err) {
    if (isRedirectError(err)) {
      throw err;
    }
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: "Internal server error" };
    }
  }
};
