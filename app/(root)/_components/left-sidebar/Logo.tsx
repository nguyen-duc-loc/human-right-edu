import { IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { useSidebar } from "@/contexts/sidebar";

const Logo = () => {
  const { setOpen } = useSidebar();

  return (
    <div
      className="z-20 flex items-center justify-between lg:justify-center"
      onClick={() => setOpen(!open)}
    >
      <Link href="/" className="flex items-center space-x-2 py-1 text-black">
        <Image
          src="/logo.png"
          width={140}
          height={100}
          alt="Human Right Edu logo"
        />
      </Link>
      <div
        className="z-50 dark:text-neutral-200 lg:hidden"
        onClick={() => setOpen(!open)}
      >
        <IconX />
      </div>
    </div>
  );
};

export default Logo;
