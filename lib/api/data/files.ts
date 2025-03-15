"use server";

import { fetchHandler } from "@/lib/fetch";

export const getFilesInPost = async (postSlug: string) => {
  const response = await fetchHandler(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${postSlug}/files`,
    {
      next: {
        tags: [`post-${postSlug}-files`],
      },
    }
  );

  return response.data as GetFilesInPostResponseData;
};
