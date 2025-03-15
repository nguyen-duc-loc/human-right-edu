import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import pool from "@/lib/postgresql";

export async function GET() {
  const client = await pool.connect();

  try {
    const queryTopPostsResult = await client.query(
      `SELECT
          posts.slug,
          posts.title,
          COALESCE(l."numLikes", 0) AS "numLikes"
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
        ORDER BY
          "numLikes" DESC
        LIMIT
          5
      `
    );

    const topPosts = queryTopPostsResult.rows as GetTopPostsResponseData;

    return NextResponse.json(
      {
        success: true,
        data: topPosts,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}
