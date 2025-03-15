import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { ForbiddenError, NotFoundError } from "@/lib/http-errors";
import { detectUserIdFromRequest } from "@/lib/jwt";
import pool from "@/lib/postgresql";
import { postFilesStorageS3 } from "@/lib/store/aws_s3";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const client = await pool.connect();

  try {
    const userId = (await detectUserIdFromRequest(request)) ?? -1;

    const queryPostsResult = await client.query(
      `SELECT
          posts.slug,
          users.username AS "authorUsername",
          users.avatar AS "authorAvatar",
          posts.title,
          posts.tags,
          posts.links,
          posts.content,
          posts."createdAt",
          COALESCE(lk.liked, FALSE) AS liked,
          COALESCE(l."numLikes", 0) AS "numLikes",
          COALESCE(c."numComments", 0) AS "numComments"
        FROM
          posts
          LEFT JOIN (
            SELECT
              "postId",
              COUNT(*) as "numLikes"
            FROM
              likes
            GROUP BY
              "postId"
          ) l ON posts."postId" = l."postId"
          LEFT JOIN (
            SELECT
              "postId",
              COUNT(*) as "numComments"
            FROM
              comments
            GROUP BY
              "postId"
          ) c ON posts."postId" = c."postId"
          JOIN users ON posts."authorId" = users.id
          LEFT JOIN (
            SELECT
              "postId",
              TRUE AS liked
            FROM
              likes
            WHERE
              "userId" = $1
            GROUP BY
              "postId"
          ) lk ON posts."postId" = lk."postId"
        WHERE
          posts.slug = $2
      `,
      [userId, slug]
    );

    const post: GetPostBySlugResponseData = queryPostsResult.rows[0] || null;

    return NextResponse.json(
      {
        success: true,
        data: post,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const client = await pool.connect();

  try {
    const queryPostResult = await client.query(
      `SELECT "postId", "authorId" FROM posts WHERE slug = $1`,
      [slug]
    );
    if (!queryPostResult.rowCount) {
      throw new NotFoundError("Post could not be found");
    }

    const authorId = queryPostResult.rows[0].authorId;
    const userId = await detectUserIdFromRequest(request);
    if (!userId || userId !== Number(authorId)) {
      throw new ForbiddenError();
    }

    const postId = queryPostResult.rows[0].postId;

    await client.query("BEGIN");

    const queryFilesResult = await client.query(
      `SELECT
          files."fileId",
          files.name
        FROM
          files
        WHERE
          files."postId" = $1`,
      [postId]
    );
    const foundedFiles: Omit<FileModel, "postId">[] = queryFilesResult.rows;

    await client.query(`DELETE FROM posts WHERE posts."postId" = $1`, [postId]);

    await Promise.all(
      foundedFiles.map((file) =>
        postFilesStorageS3.deleteByKey(
          process.env.AWS_BUCKET!,
          `${process.env.POST_FILES_FOLDER}/${postId}/${file.fileId}`
        )
      )
    );

    await client.query("COMMIT");

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    await client.query("ROLLBACK");

    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}
