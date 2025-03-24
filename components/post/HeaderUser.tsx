import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";

interface HeaderUserProps {
  username: string;
  time: Date;
}

const HeaderUser = ({ username }: HeaderUserProps) => {
  return (
    <div className="flex flex-col space-y-1.5 p-0">
      <Link
        href={ROUTES.user(username)}
        className="font-semibold leading-tight hover:underline hover:underline-offset-1"
      >
        {username}
      </Link>
      {/* <time className="!m-0 text-xs text-muted-foreground">
        {format(time, "dd MMMM, yyyy 'lúc' HH:mm", {
          locale: vi,
        })}
      </time> */}
    </div>
  );
};

export default HeaderUser;
