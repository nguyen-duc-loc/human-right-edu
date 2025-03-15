import React from "react";

import Tag from "@/components/Tag";

interface TagContainerProps {
  tags: Tag[];
}

const TagContainer = async ({ tags }: TagContainerProps) => {
  return (
    <div className="mx-auto grid max-w-[800px] grid-cols-3 gap-6 max-md:grid-cols-2 max-sm:grid-cols-1">
      {tags.map(({ name, count }) => (
        <article
          key={name}
          className="flex flex-col gap-2 rounded-xl bg-white px-8 py-6 dark:border dark:bg-background"
        >
          <Tag key={name} name={name} />
          <p className="text-xs">
            <span className="text-sm text-primary">{count}+</span> tài liệu
          </p>
        </article>
      ))}
    </div>
  );
};

export default TagContainer;
