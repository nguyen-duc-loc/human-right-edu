import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import {
  UnauthorizedError,
  NotFoundError,
  ValidationError,
} from "@/lib/http-errors";
import { detectUserIdFromRequest } from "@/lib/jwt";
import pool from "@/lib/postgresql";
import { CommentSchema } from "@/lib/validation";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const client = await pool.connect();

  try {
    const queryPostResult = await client.query(
      `SELECT "postId" FROM posts WHERE slug = $1`,
      [slug]
    );
    if (!queryPostResult.rowCount) {
      throw new NotFoundError("Post could not be found");
    }

    const postId = queryPostResult.rows[0].postId;

    const queryCommentsResult = await client.query(
      `SELECT
          users.username AS "commenterUsername",
          users.avatar AS "commenterAvatar",
          comments.content,
          comments."createdAt"
        FROM
          users
          JOIN comments ON users.id = comments."userId"
        WHERE
          comments."postId" = $1`,
      [postId]
    );
    const comments: GetCommentsInPost = queryCommentsResult.rows;

    return NextResponse.json(
      {
        success: true,
        data: comments,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}

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

    const body = await request.json();

    const validatedData = CommentSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { content } = validatedData.data;

    await client.query(
      `INSERT INTO comments("userId", "postId", "content") VALUES($1, $2, $3);`,
      [userId, postId, content]
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          userId,
          postId,
          comment: content,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}
