import React from "react";

import LocalSearch from "@/components/LocalSearch";
import Post from "@/components/post";
import LoadMore from "@/components/post/LoadMore";
import NoPost from "@/components/post/NoPost";
import ROUTES from "@/constants/routes";
import { getPosts } from "@/lib/api/data/posts";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ name: string }>;
}) => {
  const { name } = await params;
  return {
    title: name,
    description: `Chủ đề ${name}`,
  };
};

const ViewPostHasSpecificTag = async ({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const [{ name }, { query }] = await Promise.all([params, searchParams]);

  const decodedName = decodeURIComponent(name);
  const limit = 10;
  const data = await getPosts({ limit, tag: decodedName, query });
  const { posts, nextPage } = data;

  return (
    <>
      <LocalSearch
        route={ROUTES.tag(name)}
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
              tag={decodedName}
              query={query}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ViewPostHasSpecificTag;
