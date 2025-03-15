"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

import { AUTH_TOKEN_KEY } from "@/lib/cookies";

import { fetchHandler } from "../../fetch";
import { CreatePostData } from "../../validation";

export const createPost = async (data: CreatePostData) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (typeof value !== "string") {
      for (const v of value) {
        formData.append(key, v);
      }
    } else {
      formData.append(key, value);
    }
  }

  const response = await fetchHandler(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${(await cookies()).get(AUTH_TOKEN_KEY)?.value}`,
      },
      body: formData,
    },
    false
  );

  return response;
};

export const likePost = async (slug: string) => {
  const response = await fetchHandler(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${slug}/like`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${(await cookies()).get(AUTH_TOKEN_KEY)?.value}`,
      },
    }
  );

  if (response.success) {
    revalidateTag(`post-${slug}`);
  }

  return response;
};

export const unlikePost = async (slug: string) => {
  const response = await fetchHandler(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${slug}/unlike`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${(await cookies()).get(AUTH_TOKEN_KEY)?.value}`,
      },
    }
  );

  return response;
};

export const deletePost = async (slug: string) => {
  const response = await fetchHandler(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${slug}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${(await cookies()).get(AUTH_TOKEN_KEY)?.value}`,
      },
    }
  );

  return response;
};
