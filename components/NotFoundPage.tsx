import { House } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "./ui/button";

const NotFoundPage = ({ message }: { message: string }) => {
  return (
    <div className="mt-48 space-y-8">
      <div className="flex items-center justify-center">
        <span className="border-r-2 py-2 pr-8 text-2xl font-semibold max-[400px]:hidden">
          404
        </span>
        <p className="pl-8 text-sm max-[400px]:pl-0">{message}</p>
      </div>
      <div className="text-center">
        <Button asChild variant="outline">
          <Link href="/">
            <House />
            Trở về trang chủ
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
