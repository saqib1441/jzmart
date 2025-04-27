import { prisma } from "@/server/db/config";
import ResponseHandler from "@/server/utils/ResponseHandler";
import { NextRequest } from "next/server";
import UserId from "@/server/utils/UserId";
import ErrorHandler from "@/server/utils/ErrorHandler";
import { formatError } from "@/server/utils/errorMessage";

export const PUT = async (req: NextRequest) => {
  try {
    // Parse request body to get new name
    const { name, address, city, interest, phone } = await req.json();

    // Get the authenticated user ID (you should implement auth inside `UserId`)
    const id = await UserId();

    // Update user's name
    await prisma.user.update({
      where: { id },
      data: { name, address, city, interest, phone },
    });

    return ResponseHandler(200, "Profile updated successfully");
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    const errMessage = formatError(error);
    return ErrorHandler(500, errMessage, err.stack);
  }
};
