import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/http-errors";
import { detectUserIdFromRequest } from "@/lib/jwt";
import pool from "@/lib/postgresql";
import { SignUpSchema, UserSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const body = await request.json();

    const validatedData = SignUpSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { email, username, password } = validatedData.data;

    const queryExistingUserResult = await client.query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );
    if (queryExistingUserResult.rowCount) {
      throw new ConflictError("Tên người dùng hoặc email đã tồn tại");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserResult = await client.query(
      `INSERT INTO users(email, username, "hashedPassword") VALUES ($1, $2, $3) RETURNING id, username, email`,
      [email, username, hashedPassword]
    );

    const newUser: CreateUserResponseData = insertUserResult.rows[0];

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}

export async function PUT(request: Request) {
  const client = await pool.connect();

  try {
    const userId = await detectUserIdFromRequest(request);
    if (!userId) {
      throw new UnauthorizedError();
    }

    const body = await request.json();

    const validatedData = UserSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { email, username, bio, avatar } = validatedData.data;

    const queryUserResult = await client.query(
      "SELECT id FROM users WHERE id = $1",
      [userId]
    );
    if (!queryUserResult.rowCount) {
      throw new NotFoundError("Người dùng không tồn tại");
    }

    const queryExistingUserResult = await client.query(
      "SELECT id FROM users WHERE id != $1 AND (email = $2 OR username = $3)",
      [userId, email, username]
    );
    if (queryExistingUserResult.rowCount) {
      throw new ConflictError("Tên người dùng hoặc email đã tồn tại");
    }

    const updateUserResult = await client.query(
      `UPDATE users SET email = $1, username = $2, avatar = $3, bio = $4 WHERE users.id = $5 RETURNING username, email, avatar, bio`,
      [email, username, avatar || null, bio || null, userId]
    );

    const newUser: UpdateUserResponseData = updateUserResult.rows[0];

    return NextResponse.json({ success: true, data: newUser }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}
