"use server";

import { fetchHandler } from "@/lib/fetch";

export const getCommentsInPost = async (postSlug: string) => {
  const response = await fetchHandler(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${postSlug}/comments`,
    {
      next: {
        tags: [`post-${postSlug}-comments`],
      },
    }
  );

  return response.data as GetCommentsInPost;
};
