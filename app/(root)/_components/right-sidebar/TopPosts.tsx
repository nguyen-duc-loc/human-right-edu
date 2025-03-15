import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { getTopPosts } from "@/lib/api/data/posts";

const TopPosts = async () => {
  const topPosts = await getTopPosts();

  return (
    <div>
      <h3 className="text-xl font-bold tracking-tight">
        Tài liệu được yêu thích
      </h3>
      <div className="mt-7 space-y-5">
        {topPosts?.map(({ slug, title }) => (
          <Link
            key={`top-post-${slug}`}
            className="group/top-post flex items-center justify-between gap-2 text-sm font-medium hover:text-primary"
            href={ROUTES.post(slug)}
          >
            <span className="line-clamp-2 transition duration-150 group-hover/top-post:translate-x-1">
              {title}
            </span>
            <span className="w-auto">
              <ChevronRight className="size-5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopPosts;
