import React from "react";

import LocalSearch from "@/components/LocalSearch";
import Post from "@/components/post";
import NoPost from "@/components/post/NoPost";
import ROUTES from "@/constants/routes";
import { getPosts } from "@/lib/api/data/posts";

import LoadMore from "../../components/post/LoadMore";

const DashboardPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const { query } = await searchParams;
  const limit = 10;
  const data = await getPosts({ limit, query });
  const { posts, nextPage } = data;

  return (
    <>
      <LocalSearch
        route={ROUTES.home}
        placeholder="Tìm kiếm tài liệu"
        otherClasses="max-w-[700px]"
      />
      <div className="mx-auto grid max-w-[700px] gap-4 md:grid-cols-2">
        {posts.length === 0 ? (
          <NoPost />
        ) : (
          <>
            {posts.map((post) => (
              <Post post={post} compact key={`post-${post.slug}`} />
            ))}
            <LoadMore
              nextPage={nextPage}
              fetchFn={getPosts}
              limit={limit}
              query={query}
            />
          </>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
