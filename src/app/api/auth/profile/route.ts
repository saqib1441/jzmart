import { prisma } from "@/lib/db/config";
import { isAuthorized } from "@/utils/authorization";
import ErrorHandler from "@/utils/ErrorHandler";
import { formatError } from "@/utils/errorMessage";
import ResponseHandler from "@/utils/ResponseHandler";

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const GET = async () => {
  try {
    const isLoggedIn = await isAuthorized();

    if (!isLoggedIn)
      return ErrorHandler(401, "Please login first to access this page.");

    const user = await prisma.user.findUnique({
      where: { id: isLoggedIn.id },
      omit: {
        password: true,
      },
    });

    if (!user) {
      return ErrorHandler(404, "User not found.");
    }

    return ResponseHandler(200, "Profile fetched successfully", user);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    const errMessage = formatError(error);
    return ErrorHandler(500, errMessage, err.stack);
  }
};
