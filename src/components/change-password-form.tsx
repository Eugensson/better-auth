"use client";

import { toast } from "sonner";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { changePasswordAction } from "@/actions/change-password.action";

export const ChangePasswordForm = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    setIsPending(true);

    const formData = new FormData(evt.target as HTMLFormElement);

    const { error } = await changePasswordAction(formData);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Password changed successfully!");
      (evt.target as HTMLFormElement).reset();
    }

    setIsPending(false);
  };

  return (
    <form className="max-w-sm w-full space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input type="password" id="currentPassword" name="currentPassword" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input type="password" id="newPassword" name="newPassword" />
      </div>

      <Button type="submit" disabled={isPending}>
        Change Password
      </Button>
    </form>
  );
};
