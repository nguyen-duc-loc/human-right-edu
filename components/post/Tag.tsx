import { X } from "lucide-react";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";

interface TagProps {
  name: string;
  remove?: boolean;
  disabled?: boolean;
  handleRemove?: () => void;
  className?: string;
}

const Tag = ({
  name,
  remove = false,
  disabled = false,
  handleRemove,
  className,
}: TagProps) => {
  return remove ? (
    <div
      className={`flex items-center gap-2 truncate rounded-md bg-primary/15 px-4 py-2 text-xs font-medium uppercase text-primary dark:border dark:bg-muted ${className}`}
    >
      <span>{name}</span>
      <button type="button" disabled={disabled} onClick={handleRemove}>
        <X className="size-3 cursor-pointer" />
      </button>
    </div>
  ) : (
    <Link
      className={`max-w-fit truncate rounded-md bg-primary/15 px-4 py-2 text-xs font-medium uppercase text-primary dark:border dark:bg-muted ${className} transition duration-150 hover:translate-x-1`}
      href={ROUTES.tag(name)}
    >
      {name}
    </Link>
  );
};

export default Tag;
