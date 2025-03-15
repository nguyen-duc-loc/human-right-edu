import { notFound } from "next/navigation";
import React, { Suspense } from "react";

import Comments from "@/app/(root)/post/[slug]/_components/Comments";
import Post from "@/components/post";
import Spinner from "@/components/Spinner";
import { Separator } from "@/components/ui/separator";
import { getFilesInPost } from "@/lib/api/data/files";
import { getPostBySlug } from "@/lib/api/data/posts";
import { getMe } from "@/lib/api/data/users";

import CommentArea from "./_components/CommentArea";

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

const ViewPostPage = async ({
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

  return (
    <Post post={post} compact={false} files={files} me={me}>
      <Separator className="mx-auto" style={{ width: "90%" }} />
      <div className="px-6">
        <CommentArea me={me} postSlug={slug} />
        <Suspense
          fallback={
            <div className="flex justify-center">
              <Spinner className="stroke-primary" />
            </div>
          }
        >
          <Comments postSlug={slug} />
        </Suspense>
      </div>
    </Post>
  );
};

export default ViewPostPage;
