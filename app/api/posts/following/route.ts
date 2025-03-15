import { NextRequest, NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { UnauthorizedError } from "@/lib/http-errors";
import { detectUserIdFromRequest } from "@/lib/jwt";
import pool from "@/lib/postgresql";

export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const userId = await detectUserIdFromRequest(request);
    if (!userId) {
      throw new UnauthorizedError();
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;
    const query = searchParams.get("query") || "";
    const offset = limit * (page - 1);

    const totalPosts: number = Number(
      (
        await client.query(
          `SELECT
              COUNT(posts.*) AS count
            FROM
              posts
              JOIN follows on posts."authorId" = follows.followee
            WHERE
              follows.follower = $1 AND posts.title ILIKE $2`,
          [userId, `%${query}%`]
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
          JOIN follows on posts."authorId" = follows.followee
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
          follows.follower = $1 AND posts.title ILIKE $2
        ORDER BY
          posts."createdAt" DESC
        LIMIT $3
        OFFSET $4
      `,
      [userId, `%${query}%`, limit, offset]
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
