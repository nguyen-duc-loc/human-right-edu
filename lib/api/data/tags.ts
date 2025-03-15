"use server";

import { fetchHandler } from "@/lib/fetch";

export const getTags = async (
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
    query: String(query),
  });

  const response = await fetchHandler(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/tags?${searchParams.toString()}`
  );

  return response.data as GetTagsResponseData;
};
