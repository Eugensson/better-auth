"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { updateUser } from "@/lib/auth-client";

interface UpdateUserFormProps {
  name: string;
  image: string;
}

export const UpdateUserForm = ({ name, image }: UpdateUserFormProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const formData = new FormData(evt.target as HTMLFormElement);
    const name = String(formData.get("name"));
    const image = String(formData.get("image"));

    if (!name && !image) {
      return toast.error("Please enter a name or image.");
    }

    await updateUser({
      ...(name && { name }),
      image,
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
          toast.success("User updated successfully!");
          (evt.target as HTMLFormElement).reset();
          router.refresh();
        },
      },
    });
  };

  return (
    <form className="max-w-sm w-full space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={name} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="image">Image URL</Label>
        <Input type="url" id="image" name="image" defaultValue={image} />
      </div>

      <Button type="submit" disabled={isPending}>
        Update User
      </Button>
    </form>
  );
};
