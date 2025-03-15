import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

import { AUTH_TOKEN_KEY } from "./cookies";
import { BadRequestError, UnauthorizedError } from "./http-errors";

export const sign = async (payload: AuthTokenPayload): Promise<string> => {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + Number(process.env.JWT_MAX_AGE);

  return new SignJWT({ ...payload })
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
};

const verifyTokenInRequest = async (request: Request) => {
  const authHeader = request.headers.get("Authorization")?.split(" ");

  if (!authHeader || authHeader.length !== 2 || authHeader[0] !== "Bearer") {
    throw new BadRequestError("Required token is missing or invalid");
  }

  const token = authHeader[1];
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET)
  );

  return payload as AuthTokenPayload;
};

export const verifyTokenInCookies = async () => {
  const authToken = (await cookies()).get(AUTH_TOKEN_KEY)?.value;

  if (!authToken) {
    throw new UnauthorizedError("Authentication token is missing");
  }

  const { payload } = await jwtVerify(
    authToken,
    new TextEncoder().encode(process.env.JWT_SECRET)
  );
  return payload as AuthTokenPayload;
};

export const detectUserIdFromRequest = async (request: Request) => {
  try {
    const payload = await verifyTokenInRequest(request);

    return Number(payload.userId);
  } catch {
    return undefined;
  }
};

export const detectUserIdFromCookies = async () => {
  try {
    const payload = await verifyTokenInCookies();

    return Number(payload.userId);
  } catch {
    return undefined;
  }
};
