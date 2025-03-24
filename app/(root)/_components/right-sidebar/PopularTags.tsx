import React from "react";

import Tag from "@/components/post/Tag";
import { getTags } from "@/lib/api/data/tags";

const PopularTags = async () => {
  const popularTags = await getTags();

  return (
    <div>
      <h3 className="text-xl font-bold tracking-tight">Chủ đề phổ biến</h3>
      <div className="mt-7 space-y-5">
        {popularTags?.tags.map(({ name, count }) => (
          <div
            key={`tag-${name}`}
            className="flex items-center justify-between gap-4"
          >
            <Tag name={name} />
            <span className="text-xs font-medium">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularTags;
