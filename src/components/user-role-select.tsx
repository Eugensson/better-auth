"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { admin } from "@/lib/auth-client";
import { UserRole } from "@/generated/prisma/enums";

interface UserRoleSelectProps {
  userId: string;
  role: UserRole;
}

export function UserRoleSelect({ userId, role }: UserRoleSelectProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);

  async function handleChange(newRole: string) {
    const canChangeRole = await admin.hasPermission({
      permissions: {
        user: ["set-role"],
      },
    });

    if (canChangeRole.error) {
      return toast.error("Forbidden");
    }

    await admin.setRole({
      userId,
      role: newRole as UserRole,
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
          toast.success("User role updated");
          router.refresh();
        },
      },
    });
  }

  return (
    <Select
      value={role}
      onValueChange={handleChange}
      disabled={role === UserRole.ADMIN || isPending}
    >
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
        <SelectItem value={UserRole.USER}>User</SelectItem>
      </SelectContent>
    </Select>
  );
}
