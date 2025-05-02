import { prisma } from "@/lib/db/config";
import ResponseHandler from "@/utils/ResponseHandler";
import { NextRequest } from "next/server";
import ErrorHandler from "@/utils/ErrorHandler";
import { formatError } from "@/utils/errorMessage";
import { isAuthorized } from "@/utils/authorization";

export const PUT = async (req: NextRequest) => {
  try {
    const isLoggedIn = await isAuthorized();

    if (!isLoggedIn)
      return ErrorHandler(401, "Please login first to update your profile");

    const { name, address, city, interest, phone } = await req.json();

    // Update user's name
    await prisma.user.update({
      where: { id: isLoggedIn.id },
      data: { name, address, city, interest, phone },
    });

    return ResponseHandler(200, "Profile updated successfully");
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    const errMessage = formatError(error);
    return ErrorHandler(500, errMessage, err.stack);
  }
};
