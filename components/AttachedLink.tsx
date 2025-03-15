import { X } from "lucide-react";
import Link from "next/link";
import React from "react";

interface AttachedLinkProps {
  url: string;
  remove?: boolean;
  disabled?: boolean;
  handleRemove?: () => void;
  className?: string;
}

const AttachedLink = ({
  url,
  remove = false,
  disabled = false,
  handleRemove,
  className,
}: AttachedLinkProps) => {
  return remove ? (
    <div
      className={`flex items-center gap-2 truncate text-sm font-medium underline underline-offset-2 ${className}`}
    >
      <Link href={url} target="_blank">
        {url}
      </Link>
      <button disabled={disabled} onClick={handleRemove}>
        <X className="size-3 cursor-pointer" />
      </button>
    </div>
  ) : (
    <Link
      className={`max-w-fit truncate rounded-md text-sm font-medium underline underline-offset-2 ${className}`}
      href={url}
      target="_blank"
    >
      {url}
    </Link>
  );
};

export default AttachedLink;
