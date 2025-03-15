"use client";

import { Pen } from "lucide-react";
import Link from "next/link";
import numeral from "numeral";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { followUser, unfollowUser } from "@/lib/api/actions/users";

import ActionBtn from "./ActionBtn";

interface InformationProps {
  user: {
    id: number;
    username: string;
    email: string;
    avatar: string | null;
    bio: string | null;
    postCount: number;
    followerCount: number;
    followingCount: number;
    following: boolean;
  };
  signedInUserId?: number;
}

const Information = ({ user, signedInUserId }: InformationProps) => {
  const {
    id: userId,
    username,
    email,
    avatar,
    bio,
    postCount,
    followerCount,
    followingCount,
    following,
  } = user;

  const btnProps = {
    className: "w-fit",
    variant:
      !signedInUserId || (signedInUserId !== userId && !following)
        ? "default"
        : "outline",
  };

  return (
    <div className="flex items-start gap-6 max-sm:flex-col max-sm:items-center">
      <Avatar className="size-36 rounded-full object-cover">
        <AvatarImage src={avatar ?? undefined} alt={`${avatar} avatar`} />
        <AvatarFallback className="border text-5xl">
          {username[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="grow space-y-6">
        <div className="flex justify-between gap-4 max-sm:flex-col max-sm:items-center">
          <div className="max-sm:text-center">
            <h2 className="text-xl font-bold">{`@${username}`}</h2>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
          {!signedInUserId ? null : signedInUserId !== userId && !following ? (
            <ActionBtn
              btnType="FOLLOW"
              onSubmit={() => followUser(username)}
              successMessage={`Đã theo dõi ${username}`}
              {...btnProps}
            />
          ) : signedInUserId === userId ? (
            <Button asChild variant="outline">
              <Link href={ROUTES.settings} {...btnProps}>
                <Pen />
                Chỉnh sửa trang cá nhân
              </Link>
            </Button>
          ) : (
            <ActionBtn
              btnType="UNFOLLOW"
              onSubmit={() => unfollowUser(username)}
              successMessage={`Đã bỏ theo dõi ${username}`}
              {...btnProps}
            />
          )}
        </div>
        <div className="flex items-center gap-8 max-sm:justify-center">
          <div className="text-center">
            <p className="font-semibold uppercase">
              {numeral(postCount).format("0.[0]a")}
            </p>
            <p className="text-sm text-muted-foreground">tài liệu</p>
          </div>
          <div className="text-center">
            <p className="font-semibold uppercase">
              {numeral(followerCount).format("0.[0]a")}
            </p>
            <p className="text-sm text-muted-foreground">người theo dõi</p>
          </div>
          <div className="text-center">
            <p className="font-semibold uppercase">
              {numeral(followingCount).format("0.[0]a")}
            </p>
            <p className="text-sm text-muted-foreground">đang theo dõi</p>
          </div>
        </div>
        <p className="break-all max-sm:text-center">{bio}</p>
      </div>
    </div>
  );
};

export default Information;
