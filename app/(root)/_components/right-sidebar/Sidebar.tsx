import React from "react";

import PopularTags from "./PopularTags";
import TopPosts from "./TopPosts";

const Sidebar = () => {
  return (
    <aside className="sticky top-0 flex h-full w-[350px] min-w-0 flex-col gap-10 overflow-auto border-l px-6 py-10 dark:bg-background max-xl:hidden [&>*]:grow">
      <TopPosts />
      <PopularTags />
    </aside>
  );
};

export default Sidebar;
