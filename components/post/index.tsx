"use client";

import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { MessageCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { deletePost, likePost, unlikePost } from "@/lib/api/actions/posts";

import Tag from "../Tag";
import ActionBtn from "./ActionBtn";
import File from "./File";
import HeaderAvatar from "./HeaderAvatar";
import HeaderUser from "./HeaderUser";
import AttachedLink from "../AttachedLink";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

type PostProps = {
  post: GetPostBySlugResponseData;
  files?: GetFilesInPostResponseData;
  compact?: boolean;
  me?: User | null;
  children?: React.ReactNode;
};

const Post = ({ post, compact, me, files, children }: PostProps) => {
  const {
    title,
    content,
    createdAt,
    authorUsername,
    authorAvatar,
    slug,
    tags,
    links,
    numLikes,
    numComments,
    liked,
  } = post;

  return (
    <Card className={`mx-auto ${compact ? "w-full" : "max-w-[750px]"} p-4`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <HeaderAvatar image={authorAvatar} username={authorUsername} />
          <HeaderUser username={authorUsername} time={createdAt} />
        </div>
        {!compact && me?.username === authorUsername && (
          <ActionBtn
            btnType="DELETE"
            Icon={Trash2}
            className="mr-6 stroke-red-500"
            onSubmit={() => deletePost(slug)}
            successMessage="Xoá tài liệu thành công"
            redirect={ROUTES.home}
          />
        )}
      </CardHeader>
      <CardContent>
        {compact ? (
          <Link
            href={ROUTES.post(slug)}
            className="block break-words text-2xl font-bold leading-tight"
          >
            {title}
          </Link>
        ) : (
          <p className="break-words text-2xl font-bold leading-tight">
            {title}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-4">
          {tags.map((tag, idx) => (
            <Tag key={`tag-${idx}`} name={tag} />
          ))}
        </div>
        {!compact && content.length > 0 && (
          <div className="my-6 leading-loose">
            {content.split("\\n").map((paragraph, index) => (
              <React.Fragment key={`post-${slug}-paragraph-${index}`}>
                <p>{paragraph}</p>
              </React.Fragment>
            ))}
          </div>
        )}
        {!compact && links.length > 0 && (
          <ul className="my-4 ml-8 list-disc [&>li]:mt-2">
            {links.map((link, idx) => (
              <li key={`link-${idx}`}>
                <AttachedLink url={link} />
              </li>
            ))}
          </ul>
        )}
        {!compact && files && files.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {files?.map((file, idx) => (
              <File key={`post-${slug}-file-${idx}`} file={file} />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-6">
        <ActionBtn
          Icon={IconHeart}
          IconFilled={IconHeartFilled}
          filled={liked}
          filledClassName="text-rose-600"
          number={Number(numLikes)}
          compact={compact}
          btnType="LIKE"
          onSubmit={() => (liked ? unlikePost(slug) : likePost(slug))}
          actionDisabled={!me}
        />
        <ActionBtn
          Icon={MessageCircle}
          number={Number(numComments)}
          compact={compact}
          btnType="COMMENT"
        />
      </CardFooter>
      {children}
    </Card>
  );
};

export default Post;
