"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

import { AUTH_TOKEN_KEY } from "@/lib/cookies";
import { fetchHandler } from "@/lib/fetch";
import { UserData } from "@/lib/validation";

export const followUser = async (username: string) => {
  const response = await fetchHandler(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${username}/follow`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${(await cookies()).get(AUTH_TOKEN_KEY)?.value}`,
      },
    }
  );

  if (response.success) {
    revalidateTag(`user-${username}`);
  }

  return response;
};

export const unfollowUser = async (username: string) => {
  const response = await fetchHandler(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${username}/unfollow`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${(await cookies()).get(AUTH_TOKEN_KEY)?.value}`,
      },
    }
  );

  if (response.success) {
    revalidateTag(`user-${username}`);
  }

  return response;
};

export const updateUser = async (data: UserData) => {
  const response = await fetchHandler(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${(await cookies()).get(AUTH_TOKEN_KEY)?.value}`,
      },
    }
  );

  if (response.success) {
    revalidateTag("me");
  }

  return response;
};
