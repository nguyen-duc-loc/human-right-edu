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
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const client = await pool.connect();

  try {
    const requestUserId = await detectUserIdFromRequest(request);
    if (!requestUserId) {
      throw new UnauthorizedError();
    }

    const queryUserResult = await client.query(
      `SELECT id FROM users WHERE username = $1`,
      [username]
    );
    if (!queryUserResult.rowCount) {
      throw new NotFoundError("User could not be found");
    }
    const userId = queryUserResult.rows[0].id;

    const queryFollowResult = await client.query(
      `SELECT 1 FROM follows WHERE follower = $1 AND followee = $2`,
      [requestUserId, userId]
    );
    if (queryFollowResult.rowCount) {
      throw new BadRequestError("User is already followed");
    }

    await client.query(
      `INSERT INTO follows(follower, followee) VALUES($1, $2)`,
      [requestUserId, userId]
    );

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
