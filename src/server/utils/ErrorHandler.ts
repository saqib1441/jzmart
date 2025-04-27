import { ErrorType } from "@/types/types";
import { NextResponse } from "next/server";

const ErrorHandler = (status: number, message: string, stack?: string) => {
  const response: ErrorType = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = stack;
  }
  return NextResponse.json(response, {
    status: status || 500,
  });
};

export default ErrorHandler;
