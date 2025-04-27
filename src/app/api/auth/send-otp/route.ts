import { prisma } from "@/server/db/config";
import { Purpose } from "@/types/types";
import ErrorHandler from "@/server/utils/ErrorHandler";
import { NextRequest, NextResponse } from "next/server";
import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken";
import sendEmail from "@/server/utils/sendEmail";
import ResponseHandler from "@/server/utils/ResponseHandler";
import { formatError } from "@/server/utils/errorMessage";

// Ensure JWT secret is available at runtime
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

// @desc    Send Otp
// @route   POST /api/auth/send-otp
// @access  Public
export const POST = async (req: NextRequest) => {
  try {
    // Parse and extract input from request body
    const { email, purpose } = await req.json();

    // Validate presence of required fields
    if (!email || !purpose) {
      return ErrorHandler(400, "Email and purpose are required.");
    }

    // Check if user exists or not
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Prevent duplicate registration
    if (purpose === "REGISTER" && user) {
      return NextResponse.json(
        { success: false, message: "User already exists." },
        { status: 409 }
      );
    }

    // Cannot reset password if user doesn't exist
    if (purpose === "FORGOT_PASSWORD" && !user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Clean up expired OTPs from the database
    await prisma.otp.deleteMany({
      where: {
        otpExpiry: { lt: new Date() },
      },
    });

    // Check if a valid (unexpired) OTP already exists
    const existingOtp = await prisma.otp.findFirst({
      where: {
        email,
        purpose: purpose as Purpose,
        otpExpiry: { gt: new Date() },
      },
    });

    if (existingOtp) {
      try {
        // Verify the existing OTP using JWT
        const decoded = jwt.verify(existingOtp.otp, JWT_SECRET) as {
          otp: string;
        };

        // Extend expiry time
        existingOtp.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await prisma.otp.update({
          where: { id: existingOtp.id },
          data: { otpExpiry: existingOtp.otpExpiry },
        });

        // Resend the decoded raw OTP to user
        await sendEmail(email, decoded.otp);

        return ResponseHandler(
          200,
          "OTP sent successfully. Please check your email."
        );
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error("Unknown error");
        const errMessage = formatError(error);
        return ErrorHandler(500, errMessage, err.stack);
      }
    }

    // Generate a new 6-digit numeric OTP
    const rawOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // Set expiry time to 10 minutes
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Encrypt OTP using JWT before storing
    const encryptedOtp = jwt.sign({ otp: rawOtp }, JWT_SECRET, {
      expiresIn: "10m",
    });

    const modifiedEmail = email.trim().toLocaleLowerCase();

    // Create a new OTP record
    await prisma.otp.create({
      data: {
        email: modifiedEmail,
        otp: encryptedOtp,
        otpExpiry,
        purpose,
      },
    });

    // Send raw OTP to user's email
    await sendEmail(email, rawOtp);

    return ResponseHandler(
      200,
      "OTP sent successfully. Please check your email."
    );
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    const errMessage = formatError(error);
    return ErrorHandler(500, errMessage, err.stack);
  }
};
