import { prisma } from "@/server/db/config";
import ErrorHandler from "@/server/utils/ErrorHandler";
import { formatError } from "@/server/utils/errorMessage";
import ResponseHandler from "@/server/utils/ResponseHandler";
import UserId from "@/server/utils/UserId";

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const GET = async () => {
  try {
    const userId = await UserId();

    if (!userId) {
      return ErrorHandler(401, "Please login first to access this page.");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        address: true,
        interest: true,
        role: true,
        createdAt: true,
        updatedAt: true,
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
