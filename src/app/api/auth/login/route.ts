import { prisma } from "@/lib/db/config";
import ErrorHandler from "@/utils/ErrorHandler";
import { formatError } from "@/utils/errorMessage";
import { verifyPassword } from "@/utils/HandlePassword";
import ResponseHandler from "@/utils/ResponseHandler";
import StoreCookie from "@/utils/StoreCookie";
import { NextRequest } from "next/server";

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password)
      return ErrorHandler(400, "Email and password are required.");

    // Find user by unique email and select required fields
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!existingUser) return ErrorHandler(404, "User not found.");

    // Verify password
    const isValidPassword = await verifyPassword(
      existingUser.password,
      password
    );
    if (!isValidPassword) return ErrorHandler(401, "Invalid credentials.");

    // Get full user data excluding password
    const user = await prisma.user.findUnique({
      where: { id: existingUser.id },
      omit: {
        password: true,
      },
    });

    await StoreCookie(user?.id ?? "");

    return ResponseHandler(200, "Logged in successfully.", user);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    const errMessage = formatError(error);
    return ErrorHandler(500, errMessage, err.stack);
  }
};
