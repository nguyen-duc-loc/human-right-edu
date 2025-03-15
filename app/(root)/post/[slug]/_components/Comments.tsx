import React, { Fragment } from "react";

import HeaderAvatar from "@/components/post/HeaderAvatar";
import HeaderUser from "@/components/post/HeaderUser";
import { getCommentsInPost } from "@/lib/api/data/comments";

interface CommentsProps {
  postSlug: string;
}

const Comments = async ({ postSlug }: CommentsProps) => {
  const comments = await getCommentsInPost(postSlug);

  return (
    <div id="comments">
      {comments.map(
        ({ commenterUsername, commenterAvatar, createdAt, content }, idx1) => (
          <div
            key={`post-${postSlug}-comment-${idx1}`}
            className="mb-5 flex gap-3"
          >
            <HeaderAvatar
              image={commenterAvatar}
              username={commenterUsername}
            />
            <div className="overflow-x-auto rounded-lg border px-4 py-3">
              <HeaderUser username={commenterUsername} time={createdAt} />
              <div className="mt-2 max-w-[500px]">
                {content.split("\\n").map((paragraph, idx2) => (
                  <Fragment
                    key={`post-${postSlug}-comment-${idx1}-paragraph-${idx2}`}
                  >
                    <p className="col-start-2 break-words">{paragraph}</p>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Comments;
