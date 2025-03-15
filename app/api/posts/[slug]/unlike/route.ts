import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { NotFoundError, UnauthorizedError } from "@/lib/http-errors";
import { detectUserIdFromRequest } from "@/lib/jwt";
import pool from "@/lib/postgresql";

export async function DELETE(
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

    await client.query(
      `DELETE FROM likes WHERE "userId" = $1 AND "postId" = $2`,
      [userId, postId]
    );

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}
