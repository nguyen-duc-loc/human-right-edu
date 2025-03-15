import React from "react";

import Post from "@/components/post";
import LoadMore from "@/components/post/LoadMore";
import NoPost from "@/components/post/NoPost";
import { getPosts } from "@/lib/api/data/posts";

interface RecentPostProps {
  username: string;
}

const RecentPost = async ({ username }: RecentPostProps) => {
  const limit = 10;
  const data = await getPosts({ limit, authorUsername: username });
  const { posts, nextPage } = data;

  return posts.length === 0 ? (
    <NoPost />
  ) : (
    <div className="mt-10">
      <h2 className="mb-6 text-xl font-semibold">Tài liệu gần đây</h2>
      <div className="mx-auto grid max-w-[700px] gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <Post post={post} compact key={`post-${post.slug}`} />
        ))}
        <LoadMore
          nextPage={nextPage}
          fetchFn={getPosts}
          limit={limit}
          authorUsername={username}
        />
      </div>
    </div>
  );
};

export default RecentPost;
