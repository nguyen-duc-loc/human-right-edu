import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { NotFoundError, UnauthorizedError } from "@/lib/http-errors";
import { detectUserIdFromRequest } from "@/lib/jwt";
import pool from "@/lib/postgresql";

export async function DELETE(
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

    await client.query(
      `DELETE FROM follows WHERE follower = $1 AND followee = $2`,
      [requestUserId, userId]
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
