import { House } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import { getFilesInPost } from "@/lib/api/data/files";
import { getPostBySlug } from "@/lib/api/data/posts";
import { getMe } from "@/lib/api/data/users";

import EditPostForm from "./_components/EditPostForm";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return {
      title: "Post not found",
      description: "Post not found",
    };
  }
  return {
    title: post.title,
    description: post.title,
  };
};

const EditPostPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const [post, me, files] = await Promise.all([
    getPostBySlug(slug),
    getMe(),
    getFilesInPost(slug),
  ]);
  if (!post) {
    return notFound();
  }

  if (!me || post.authorUsername !== me.username) {
    return (
      <div className="mt-48 space-y-8">
        <div className="flex items-center justify-center">
          <span className="border-r-2 py-2 pr-8 text-2xl font-semibold max-[400px]:hidden">
            403
          </span>
          <p className="pl-8 text-sm max-[400px]:pl-0">
            Bạn không có quyền chỉnh sửa bài viết này
          </p>
        </div>
        <div className="text-center">
          <Button asChild variant="outline">
            <Link href="/">
              <House />
              Trở về trang chủ
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-9 text-3xl font-bold">Chỉnh sửa tài liệu</h1>
      <EditPostForm post={post} files={files} />
    </>
  );
};

export default EditPostPage;
