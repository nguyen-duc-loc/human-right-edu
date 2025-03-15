import { NextRequest, NextResponse } from "next/server";

import ROUTES from "./constants/routes";
import { verifyTokenInCookies } from "./lib/jwt";

export async function middleware(request: NextRequest) {
  try {
    await verifyTokenInCookies();

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL(ROUTES.signIn, request.url));
  }
}

export const config = {
  matcher: ["/following", "/settings", "/post/new"],
};
