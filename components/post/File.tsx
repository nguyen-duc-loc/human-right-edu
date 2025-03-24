import {
  IconFileTypeDoc,
  IconFileTypeDocx,
  IconFileTypeJpg,
  IconFileTypePdf,
  IconFileTypePng,
  IconFileTypePpt,
} from "@tabler/icons-react";
import { FileText, X } from "lucide-react";
import Link from "next/link";
import React from "react";

interface FileProps {
  file: PostFile;
  remove?: boolean;
  disabled?: boolean;
  handleRemove?: () => void;
}

const wrappedFileClassName =
  "flex max-w-full items-center gap-2 rounded-xl border p-4 bg-background";
const fileIconClassName = "size-5 stroke-primary";
const fileNameClassName = "max-w-56 truncate text-sm ";

const File = ({
  file,
  remove = false,
  disabled = false,
  handleRemove,
}: FileProps) => {
  const { url, name } = file;

  const WrappedFile = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) =>
    remove ? (
      <div className={className}>
        {children}
        <button type="button" disabled={disabled} onClick={handleRemove}>
          <X className="size-3 cursor-pointer" />
        </button>
      </div>
    ) : (
      <Link
        href={url || "#"}
        target="_blank"
        className={`group/file ${className}`}
      >
        {children}
      </Link>
    );

  return (
    <WrappedFile className={wrappedFileClassName}>
      <div className="rounded-lg bg-gray-100 p-2 dark:bg-muted">
        {name.endsWith("pdf") ? (
          <IconFileTypePdf className={fileIconClassName} />
        ) : name.endsWith("doc") ? (
          <IconFileTypeDoc className={fileIconClassName} />
        ) : name.endsWith("docx") ? (
          <IconFileTypeDocx className={fileIconClassName} />
        ) : name.endsWith("ppt") || name.endsWith("pptx") ? (
          <IconFileTypePpt className={fileIconClassName} />
        ) : name.endsWith("jpg") ? (
          <IconFileTypeJpg className={fileIconClassName} />
        ) : name.endsWith("png") ? (
          <IconFileTypePng className={fileIconClassName} />
        ) : (
          <FileText className={fileIconClassName} />
        )}
      </div>
      <p
        className={`${fileNameClassName} ${
          !remove && "transition duration-150 group-hover/file:translate-x-1"
        }`}
      >
        {name}
      </p>
    </WrappedFile>
  );
};

export default File;
