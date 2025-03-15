import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { UnauthorizedError, NotFoundError } from "@/lib/http-errors";
import { detectUserIdFromRequest } from "@/lib/jwt";
import pool from "@/lib/postgresql";

export async function GET(request: Request) {
  const client = await pool.connect();

  try {
    const userId = await detectUserIdFromRequest(request);
    if (!userId) {
      throw new UnauthorizedError();
    }

    const queryUserResult = await client.query(
      `SELECT username, email, bio, avatar FROM users WHERE id = $1`,
      [userId]
    );
    if (queryUserResult.rowCount === 0) {
      throw new NotFoundError("Người dùng không tồn tại");
    }

    const foundUser: GetUserResponseData = queryUserResult.rows[0];

    return NextResponse.json(
      { success: true, data: foundUser },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}
