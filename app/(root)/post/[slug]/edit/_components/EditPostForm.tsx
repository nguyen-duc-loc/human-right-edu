"use client";

import React from "react";

import PostForm from "@/components/forms/PostForm";
import { editPost } from "@/lib/api/actions/posts";
import { EditPostData, EditPostSchema } from "@/lib/validation";

interface EditPostFormProps {
  post: GetPostBySlugResponseData;
  files?: PostFile[];
}

const EditPostForm = ({ post, files }: EditPostFormProps) => {
  const { slug, title, content, tags, links } = post;

  return (
    <PostForm
      formType="EDIT"
      schema={EditPostSchema}
      defaultValues={{
        title,
        content,
        tags,
        links,
        files: [],
        removedFiles: [],
      }}
      addedFiles={files}
      onSubmit={(data: EditPostData) => editPost(slug, data)}
    />
  );
};

export default EditPostForm;
