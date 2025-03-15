"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

import { AUTH_TOKEN_KEY } from "@/lib/cookies";
import { fetchHandler } from "@/lib/fetch";
import { CommentData } from "@/lib/validation";

export const comment = async (postSlug: string, data: CommentData) => {
  const response = await fetchHandler(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${postSlug}/comments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${(await cookies()).get(AUTH_TOKEN_KEY)?.value}`,
      },
      body: JSON.stringify(data),
    },
    false
  );

  if (response.success) {
    revalidateTag(`post-${postSlug}-comments`);
  }

  return response;
};
