import { Metadata } from "next";
import React from "react";

import CreatePostForm from "./_components/CreatePostForm";

export const metadata: Metadata = {
  title: "Tạo tài liệu",
  description: "Tạo tài liệu",
};

const CreateNewPostPage = () => {
  return (
    <>
      <h1 className="mb-9 text-3xl font-bold">Tạo tài liệu mới</h1>
      <CreatePostForm />
    </>
  );
};

export default CreateNewPostPage;
