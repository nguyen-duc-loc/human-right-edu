import { NextRequest, NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { BadRequestError, NotFoundError } from "@/lib/http-errors";
import { detectUserIdFromRequest } from "@/lib/jwt";
import pool from "@/lib/postgresql";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const client = await pool.connect();

  try {
    const { username } = await params;
    if (!username) {
      throw new BadRequestError("Username is required");
    }

    const requestUserId = (await detectUserIdFromRequest(request)) ?? -1;
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;
    const offset = limit * (page - 1);

    const queryUserResult = await client.query(
      `SELECT id FROM users WHERE username = $1`,
      [username]
    );
    if (queryUserResult.rowCount === 0) {
      throw new NotFoundError(`Người dùng ${username} không tồn tại`);
    }

    const userId = (queryUserResult.rows[0] as GetUserResponseData)!.id;

    const totalPosts: number = Number(
      (
        await client.query(
          `SELECT COUNT(*) AS count FROM posts WHERE "authorId" = $1`,
          [userId]
        )
      ).rows[0].count
    );

    const nextPage = limit * page < totalPosts ? page + 1 : undefined;

    const queryPostsResult = await client.query(
      `SELECT
          posts.slug,
          users.username AS "authorUsername",
          users.avatar AS "authorAvatar",
          posts.title,
          posts.tags,
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
        WHERE users.id = $2
        ORDER BY
          posts."createdAt" DESC
        LIMIT $3
        OFFSET $4
      `,
      [requestUserId, userId, limit, offset]
    );

    const allPosts = queryPostsResult.rows;

    return NextResponse.json(
      {
        success: true,
        data: { posts: allPosts, nextPage },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}
