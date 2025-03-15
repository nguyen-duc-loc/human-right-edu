import {
  IconFileTypeDoc,
  IconFileTypeDocx,
  IconFileTypeJpg,
  IconFileTypePdf,
  IconFileTypePng,
  IconFileTypePpt,
} from "@tabler/icons-react";
import { FileText } from "lucide-react";
import Link from "next/link";
import React from "react";

interface FileProps {
  file: PostFile;
}

const fileIconClassName = "size-5 stroke-primary";

const File = ({ file }: FileProps) => {
  const { url, name } = file;

  return (
    <Link
      href={url || "#"}
      target="_blank"
      className="group/file flex max-w-full items-center gap-2 rounded-xl border p-4"
    >
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
      <p className="max-w-56 truncate text-sm transition duration-150 group-hover/file:translate-x-1">
        {name}
      </p>
    </Link>
  );
};

export default File;
