"use client";

import React from "react";

import PostForm from "@/components/forms/PostForm";
import { createPost } from "@/lib/api/actions/posts";
import { CreatePostSchema, CreatePostData } from "@/lib/validation";

const CreatePostForm = () => {
  return (
    <PostForm
      formType="CREATE"
      schema={CreatePostSchema}
      defaultValues={{
        title: "",
        content: "",
        tags: [],
        files: [],
        links: [],
      }}
      onSubmit={(data: CreatePostData) => createPost(data)}
    />
  );
};

export default CreatePostForm;
