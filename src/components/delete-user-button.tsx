"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteUserAction } from "@/actions/delete-user.action";

interface DeleteUserButtonProps {
  userId: string;
}

export const DeleteUserButton = ({ userId }: DeleteUserButtonProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleDeleteUser = async () => {
    setIsPending(true);

    const { error } = await deleteUserAction({ userId });

    if (error) {
      toast.error(error);
    } else {
      toast.success("User deleted successfully!");
    }

    setIsPending(false);
  };

  return (
    <Button
      type="button"
      size="icon"
      variant="destructive"
      className="siz-7 rounded-sm"
      disabled={isPending}
      onClick={handleDeleteUser}
    >
      <span className="sr-only">Delete User</span>
      <Trash />
    </Button>
  );
};

export const PlaceholderDeleteUserButton = () => {
  return (
    <Button
      type="button"
      size="icon"
      variant="destructive"
      className="siz-7 rounded-sm"
      disabled
    >
      <span className="sr-only">Delete User</span>
      <Trash />
    </Button>
  );
};
