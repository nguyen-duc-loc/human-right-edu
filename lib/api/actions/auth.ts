"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import ROUTES from "@/constants/routes";

import { AUTH_TOKEN_KEY } from "../../cookies";
import { fetchHandler } from "../../fetch";
import { ChangePasswordData, SignInData, SignUpData } from "../../validation";

export const signin = async (data: SignInData) => {
  const response = await fetchHandler(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/sign-in`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  if (response.success) {
    const { token } = response.data as SignInResponseData;
    (await cookies()).set({
      name: AUTH_TOKEN_KEY,
      value: token,
      path: "/",
      httpOnly: true,
      maxAge: Number(process.env.JWT_MAX_AGE),
    });
    redirect(ROUTES.home);
  }

  return response;
};

export const signup = async (data: SignUpData) => {
  const response = await fetchHandler(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  if (response.success) {
    await signin({
      username: data.username,
      password: data.password,
    });
  }

  return response;
};

export const signout = async () => {
  (await cookies()).delete(AUTH_TOKEN_KEY);
  redirect(ROUTES.signIn);
};

export const changePassword = async (data: ChangePasswordData) => {
  const response = await fetchHandler(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/change-password`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${(await cookies()).get(AUTH_TOKEN_KEY)?.value}`,
      },
    }
  );

  return response;
};
