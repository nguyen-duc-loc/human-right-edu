import { notFound } from "next/navigation";
import React, { Suspense } from "react";

import Spinner from "@/components/Spinner";
import { getUserByUsername } from "@/lib/api/data/users";
import { detectUserIdFromCookies } from "@/lib/jwt";

import Information from "./_components/Information";
import RecentPost from "./_components/RecentPost";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) {
    return {
      title: "User not found",
      description: "User not found",
    };
  }
  return {
    title: `@${user.username}`,
    description: user.username,
  };
};

const UserPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const [user, signedInUserId] = await Promise.all([
    getUserByUsername(username),
    detectUserIdFromCookies(),
  ]);
  if (!user) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[800px]">
      <Information user={user} signedInUserId={signedInUserId} />
      <Suspense
        fallback={
          <div className="mt-10 flex justify-center">
            <Spinner className="stroke-primary" />
          </div>
        }
      >
        <RecentPost username={username} />
      </Suspense>
    </div>
  );
};

export default UserPage;
