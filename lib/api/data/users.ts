"use server";

import { cookies } from "next/headers";

import { AUTH_TOKEN_KEY } from "@/lib/cookies";
import { fetchHandler } from "@/lib/fetch";

export const getUserByUsername = async (username: string) => {
  const response = await fetchHandler(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${username}`,
    {
      headers: {
        Authorization: `Bearer ${(await cookies()).get(AUTH_TOKEN_KEY)?.value}`,
      },
      next: {
        tags: [`user-${username}`],
      },
    }
  );

  return (response.data || null) as GetUserResponseData;
};

export const getMe = async () => {
  const response = await fetchHandler(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/me`,
    {
      headers: {
        Authorization: `Bearer ${(await cookies()).get(AUTH_TOKEN_KEY)?.value}`,
      },
      next: {
        tags: ["me"],
      },
    }
  );

  return (response.data || null) as GetUserResponseData;
};
