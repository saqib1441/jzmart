import { prisma } from "@/lib/db/config";
import { isAuthorized } from "@/utils/authorization";
import ErrorHandler from "@/utils/ErrorHandler";
import { formatError } from "@/utils/errorMessage";
import { hashPassword, verifyPassword } from "@/utils/HandlePassword";
import ResponseHandler from "@/utils/ResponseHandler";
import { NextRequest } from "next/server";

export const PUT = async (req: NextRequest) => {
  try {
    const isLoggedIn = await isAuthorized();

    if (!isLoggedIn)
      return ErrorHandler(401, "Please login first to change password!");

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword) return ErrorHandler(400, "Old password is required");

    const user = await prisma.user.findUnique({ where: { id: isLoggedIn.id } });

    if (!user) return ErrorHandler(404, "User not found!");

    const isOldPassword = await verifyPassword(user?.password, oldPassword);

    if (!isOldPassword) return ErrorHandler(400, "Old password is incorrect");

    // Enforce a minimum password length
    if (newPassword.length < 6)
      return ErrorHandler(400, "Password must be at least 6 characters long");

    // Hash the password before saving to DB
    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: isLoggedIn.id },
      data: { password: hashedPassword },
    });

    return ResponseHandler(200, "Password changed successfully");
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    const errMessage = formatError(error);
    return ErrorHandler(500, errMessage, err.stack);
  }
};
