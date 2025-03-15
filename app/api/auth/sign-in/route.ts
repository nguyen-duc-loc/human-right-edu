import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { ValidationError, UnauthorizedError } from "@/lib/http-errors";
import { sign } from "@/lib/jwt";
import pool from "@/lib/postgresql";
import { SignInSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const body = await request.json();

    const validatedData = SignInSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { username, password } = validatedData.data;
    const invalidCredentialsErr = new UnauthorizedError(
      "Thông tin đăng nhập không chính xác"
    );

    const queryUserResult = await client.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );
    if (queryUserResult.rowCount === 0) {
      throw invalidCredentialsErr;
    }

    const foundUser: {
      id: number;
      username: string;
      email: string;
      avatar: string;
      hashedPassword: string;
    } = queryUserResult.rows[0];
    const hashedPassword = foundUser.hashedPassword;
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordCorrect) {
      throw invalidCredentialsErr;
    }

    const token = await sign({
      userId: foundUser.id,
    });

    const data: SignInResponseData = {
      token,
    };

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    client.release();
  }
}
