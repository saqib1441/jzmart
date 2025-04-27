import { prisma } from "@/server/db/config";
import ErrorHandler from "@/server/utils/ErrorHandler";
import { formatError } from "@/server/utils/errorMessage";
import { hashPassword, verifyPassword } from "@/server/utils/HandlePassword";
import ResponseHandler from "@/server/utils/ResponseHandler";
import { NextRequest } from "next/server";

export const PUT = async (req: NextRequest) => {
  try {
    const { id, oldPassword, newPassword } = await req.json();

    if (!oldPassword) {
      return ErrorHandler(400, "Old password is required");
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return ErrorHandler(404, "User not found!");
    }

    const isOldPassword = await verifyPassword(user?.password, oldPassword);

    if (!isOldPassword) {
      return ErrorHandler(400, "Old password is incorrect");
    }

    // Enforce a minimum password length
    if (newPassword.length < 6) {
      return ErrorHandler(400, "Password must be at least 6 characters long");
    }

    // Hash the password before saving to DB
    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return ResponseHandler(200, "Password changed successfully");
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    const errMessage = formatError(error);
    return ErrorHandler(500, errMessage, err.stack);
  }
};
