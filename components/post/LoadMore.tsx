"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import Spinner from "@/components/Spinner";

import Post from ".";

interface LoadMoreProps {
  nextPage?: number;
  limit: number;
  query?: string;
  tag?: string;
  authorUsername?: string;
  fetchFn: (options: {
    authorUsername?: string;
    page?: number;
    limit?: number;
    query?: string;
    tag?: string;
  }) => Promise<GetPostsResponseData>;
}

const LoadMore = ({
  nextPage,
  fetchFn,
  limit,
  query = "",
  tag = "",
  authorUsername,
}: LoadMoreProps) => {
  const { ref, inView } = useInView();
  const [posts, setPosts] = useState<GetPostBySlugResponseData[]>([]);
  const [page, setPage] = useState<number | undefined>(nextPage);

  useEffect(() => {
    if (inView) {
      if (!page) return;

      fetchFn({ page, limit, tag, authorUsername, query }).then((res) => {
        setPosts([...posts, ...res.posts]);
        setPage(res.nextPage);
      });
    }
  }, [inView, fetchFn, page, posts, limit, tag, authorUsername, query]);

  return (
    <>
      {posts.map((post) => (
        <Post post={post} compact key={`post-${post.slug}`} />
      ))}
      {page && (
        <div ref={ref} className="col-start-1 -col-end-1 flex justify-center ">
          <Spinner className="size-7 stroke-primary" />
        </div>
      )}
    </>
  );
};

export default LoadMore;
