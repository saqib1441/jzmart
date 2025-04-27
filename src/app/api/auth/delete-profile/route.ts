import { prisma } from "@/server/db/config";
import ErrorHandler from "@/server/utils/ErrorHandler";
import { formatError } from "@/server/utils/errorMessage";
import ResponseHandler from "@/server/utils/ResponseHandler";
import UserId from "@/server/utils/UserId";
import { cookies } from "next/headers";

export const DELETE = async () => {
  try {
    const id = await UserId();

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return ErrorHandler(404, "User not found");
    }

    // Delete user
    await prisma.user.delete({
      where: {
        id,
      },
    });

    const cookie = await cookies();
    cookie.delete("token");

    return ResponseHandler(200, "Account deleted successfully!");
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    const errMessage = formatError(error);
    return ErrorHandler(500, errMessage, err.stack);
  }
};
