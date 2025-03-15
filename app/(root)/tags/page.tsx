import { Metadata } from "next";
import React from "react";

import LocalSearch from "@/components/LocalSearch";
import ROUTES from "@/constants/routes";
import { getTags } from "@/lib/api/data/tags";

import Pagination from "./_components/Pagination";
import TagContainer from "./_components/TagContainer";

export const metadata: Metadata = {
  title: "Chủ đề",
  description: "Chủ đề",
};

const TagsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const { page = "", query = "" } = await searchParams;
  const currentPage = Math.max(Number(page) || 1, 1);
  const currentLimit = 12;

  const { total, tags } = await getTags({
    page: currentPage,
    limit: currentLimit,
    query,
  });

  return (
    <>
      <LocalSearch
        route={ROUTES.tags}
        otherClasses="max-w-[800px] mx-auto border"
        placeholder="Tìm kiếm chủ đề"
      />
      <TagContainer tags={tags} />
      <Pagination
        total={total}
        currentLimit={currentLimit}
        currentPage={currentPage}
      />
    </>
  );
};

export default TagsPage;
