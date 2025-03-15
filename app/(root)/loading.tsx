import React from "react";

import Spinner from "@/components/Spinner";

const Loading = () => {
  return (
    <div className="flex h-fit w-full justify-center px-8 pb-4 pt-6">
      <Spinner className="my-2 size-7 stroke-primary" />
    </div>
  );
};

export default Loading;
