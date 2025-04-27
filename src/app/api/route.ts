import ErrorHandler from "@/server/utils/ErrorHandler";
import { formatError } from "@/server/utils/errorMessage";
import ResponseHandler from "@/server/utils/ResponseHandler";

export const GET = () => {
  try {
    return ResponseHandler(200, "API is running...!");
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    const errMessage = formatError(error);
    return ErrorHandler(500, errMessage, err.stack);
  }
};
