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

const wrappedLinkClassName = "text-sm font-medium underline underline-offset-2";

const AttachedLink = ({
  url,
  remove = false,
  disabled = false,
  handleRemove,
  className,
}: AttachedLinkProps) => {
  return remove ? (
    <div
      className={`${wrappedLinkClassName} flex items-center gap-2 ${className}`}
    >
      <Link href={url} target="_blank">
        {`${url.slice(0, 50)}${url.length > 50 ? "..." : ""}`}
      </Link>
      <button type="button" disabled={disabled} onClick={handleRemove}>
        <X className="size-3 cursor-pointer" />
      </button>
    </div>
  ) : (
    <Link
      className={`${wrappedLinkClassName} ${className}`}
      href={url}
      target="_blank"
    >
      {`${url.slice(0, 50)}${url.length > 50 && "..."}`}
    </Link>
  );
};

export default AttachedLink;
