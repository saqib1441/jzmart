import { prisma } from "@/server/db/config";
import ErrorHandler from "@/server/utils/ErrorHandler";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { hashPassword } from "@/server/utils/HandlePassword";
import ResponseHandler from "@/server/utils/ResponseHandler";
import { formatError } from "@/server/utils/errorMessage";

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

export const PUT = async (req: NextRequest) => {
  try {
    const { email, password, purpose, otp } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return ErrorHandler(409, "User not found!");
    }

    const otpRecord = await prisma.otp.findFirst({
      where: {
        email,
        purpose,
        otpExpiry: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      return ErrorHandler(401, "OTP is expired or does not exist");
    }

    let decoded: { otp: string };
    try {
      decoded = jwt.verify(otpRecord.otp, JWT_SECRET) as { otp: string };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error("Unknown error");
      const errMessage = formatError(error);
      return ErrorHandler(500, errMessage, err.stack);
    }

    if (otp !== decoded.otp) {
      return ErrorHandler(401, "Invalid OTP");
    }

    if (password.length < 6) {
      return ErrorHandler(400, "Password must be at least 6 characters long");
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return ResponseHandler(200, "Password reset successfully. Please login!");
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    const errMessage = formatError(error);
    return ErrorHandler(500, errMessage, err.stack);
  }
};
