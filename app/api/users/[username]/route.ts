import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { BadRequestError, NotFoundError } from "@/lib/http-errors";
import { detectUserIdFromRequest } from "@/lib/jwt";
import pool from "@/lib/postgresql";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const client = await pool.connect();

  try {
    const { username } = await params;
    if (!username) {
      throw new BadRequestError("Username is required");
    }

    const requestUserId = (await detectUserIdFromRequest(request)) ?? -1;

    const queryUserResult = await client.query(
      `SELECT
          id,
          username,
          email,
          bio,
          avatar,
          (
            SELECT
              COUNT(*) > 0 AS following
            FROM
              follows
            WHERE
              follows.followee = users.id
              AND follows.follower = $1
          )
        FROM
          users
        WHERE
          username = $2`,
      [requestUserId, username]
    );
    if (queryUserResult.rowCount === 0) {
      throw new NotFoundError(`Người dùng ${username} không tồn tại`);
    }

    const foundUser = (queryUserResult.rows[0] as GetUserResponseData)!;
    const userId = foundUser.id;
    const [
      queryPostCountResult,
      queryFollowerCountResult,
      queryFollowingCountResult,
    ] = await Promise.all([
      client.query(
        `SELECT COUNT(*) AS count FROM posts WHERE "authorId" = $1`,
        [userId]
      ),
      client.query(
        "SELECT COUNT(*) AS count FROM follows WHERE followee = $1",
        [userId]
      ),
      client.query(
        "SELECT COUNT(*) AS count FROM follows WHERE follower = $1",
        [userId]
      ),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          ...foundUser,
          id: Number(foundUser.id),
          postCount: Number(queryPostCountResult.rows[0].count),
          followerCount: Number(queryFollowerCountResult.rows[0].count),
          followingCount: Number(queryFollowingCountResult.rows[0].count),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}
