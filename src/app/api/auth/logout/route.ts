import { isAuthorized } from "@/utils/authorization";
import ErrorHandler from "@/utils/ErrorHandler";
import { formatError } from "@/utils/errorMessage";
import ResponseHandler from "@/utils/ResponseHandler";
import { cookies } from "next/headers";

export const POST = async () => {
  try {
    const isLoggedIn = await isAuthorized();
    if (!isLoggedIn)
      return ResponseHandler(401, "Please login first to logout!");

    const cookie = await cookies();
    cookie.delete("token");

    return ResponseHandler(200, "You have logged out successfully!");
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    const errMessage = formatError(error);
    return ErrorHandler(500, errMessage, err.stack);
  }
};
