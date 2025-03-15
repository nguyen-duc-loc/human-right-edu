"use server";

import { cookies } from "next/headers";

import { AUTH_TOKEN_KEY } from "@/lib/cookies";
import { fetchHandler } from "@/lib/fetch";

export const getPosts = async (
  options: {
    authorUsername?: string;
    page?: number;
    limit?: number;
    query?: string;
    tag?: string;
  } = {}
) => {
  const {
    page = "",
    limit = "",
    query = "",
    tag = "",
    authorUsername,
  } = options;

  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    query,
    tag,
  });

  const response = !authorUsername
    ? await fetchHandler(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/posts?${searchParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${
              (await cookies()).get(AUTH_TOKEN_KEY)?.value
            }`,
          },
        }
      )
    : await fetchHandler(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/users/${authorUsername}/posts?${searchParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${
              (await cookies()).get(AUTH_TOKEN_KEY)?.value
            }`,
          },
        }
      );

  return response.data as GetPostsResponseData;
};

export const getFollowingUsersPosts = async (
  options: {
    page?: number;
    limit?: number;
    query?: string;
  } = {}
) => {
  const { page = "", limit = "", query = "" } = options;

  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    query,
  });

  const response = await fetchHandler(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL
    }/posts/following?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${(await cookies()).get(AUTH_TOKEN_KEY)?.value}`,
      },
    }
  );

  return response.data as GetPostsResponseData;
};

export const getPostBySlug = async (slug: string) => {
  const response = await fetchHandler(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${slug}`,
    {
      headers: {
        Authorization: `Bearer ${(await cookies()).get(AUTH_TOKEN_KEY)?.value}`,
      },
      next: {
        tags: [`post-${slug}`],
      },
    }
  );

  return response.data as GetPostBySlugResponseData;
};

export const getTopPosts = async () => {
  const response = await fetchHandler(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/top`
  );

  return response.data as GetTopPostsResponseData;
};
