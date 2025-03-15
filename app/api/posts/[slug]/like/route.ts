import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/http-errors";
import { detectUserIdFromRequest } from "@/lib/jwt";
import pool from "@/lib/postgresql";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const client = await pool.connect();

  try {
    const userId = await detectUserIdFromRequest(request);
    if (!userId) {
      throw new UnauthorizedError();
    }

    const queryPostResult = await client.query(
      `SELECT "postId" FROM posts WHERE slug = $1`,
      [slug]
    );
    if (!queryPostResult.rowCount) {
      throw new NotFoundError("Post could not be found");
    }
    const postId = queryPostResult.rows[0].postId;

    const queryLikeResult = await client.query(
      `SELECT 1 FROM likes WHERE "postId" = $1 AND "userId" = $2`,
      [postId, userId]
    );
    if (queryLikeResult.rowCount) {
      throw new BadRequestError("Post is already liked");
    }

    await client.query(`INSERT INTO likes("userId", "postId") VALUES($1, $2)`, [
      userId,
      postId,
    ]);

    return NextResponse.json(
      {
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}
