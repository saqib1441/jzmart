import ErrorHandler from "@/server/utils/ErrorHandler";
import { formatError } from "@/server/utils/errorMessage";
import ResponseHandler from "@/server/utils/ResponseHandler";
import { cookies } from "next/headers";

export const POST = async () => {
  try {
    const cookie = await cookies();
    cookie.delete("token");

    return ResponseHandler(200, "You have logged out successfully!");
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    const errMessage = formatError(error);
    return ErrorHandler(500, errMessage, err.stack);
  }
};
