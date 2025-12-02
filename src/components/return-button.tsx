import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ReturnButtonProps {
  href: string;
  label: string;
}

export const ReturnButton = ({ href, label }: ReturnButtonProps) => {
  return (
    <Link
      href={href}
      className={buttonVariants({
        variant: "link",
      })}
    >
      <ArrowLeft />
      {label}
    </Link>
  );
};
