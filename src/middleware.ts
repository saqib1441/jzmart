import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import ErrorHandler from "@/server/utils/ErrorHandler";

export async function middleware() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return ErrorHandler(404, "Please login first to access this page.");
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/auth/logout",
    "/api/auth/profile",
    "/api/auth/update-profile",
  ],
};
