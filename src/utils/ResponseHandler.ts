import { ResponseType } from "@/types/types";
import { NextResponse } from "next/server";

const ResponseHandler = (status: number, message: string, data?: unknown) => {
  const response: ResponseType = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return NextResponse.json(response, {
    status,
  });
};

export default ResponseHandler;
