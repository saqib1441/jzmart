import { prisma } from "@/lib/db/config";
import ErrorHandler from "@/utils/ErrorHandler";
import { formatError } from "@/utils/errorMessage";
import { hashPassword } from "@/utils/HandlePassword";
import ResponseHandler from "@/utils/ResponseHandler";
import StoreCookie from "@/utils/StoreCookie";
import { SignupData } from "@/types/types";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

// Ensure the JWT secret key is defined in environment variables
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

// @desc        Signup User
// @route       POST /api/auth/signup
// @access      Public
export const POST = async (req: NextRequest) => {
  try {
    // Parse and extract user signup data from request body
    const { name, email, password, otp, purpose }: SignupData =
      await req.json();

    // Check if a user with the provided email already exists
    const userExist = await prisma.user.findUnique({
      where: { email },
    });

    if (userExist) return ErrorHandler(409, "User already exists");

    // Find a valid, non-expired OTP for the email and purpose
    const otpExist = await prisma.otp.findFirst({
      where: {
        email,
        purpose,
        otpExpiry: {
          gt: new Date(), // Ensure OTP is not expired
        },
      },
    });

    // Return error if no valid OTP found
    if (!otpExist) return ErrorHandler(401, "OTP is expired or does not exist");

    // Decode the OTP token using JWT to extract the original OTP string
    const decoded = jwt.verify(otpExist.otp, JWT_SECRET) as { otp: string };

    // Compare user input OTP with decoded OTP
    if (otp !== decoded.otp) return ErrorHandler(401, "Invalid OTP");

    // Enforce a minimum password length
    if (password.length < 6)
      return ErrorHandler(400, "Password must be at least 6 characters long");

    // Normalize and sanitize email
    const modifiedEmail = email.trim().toLocaleLowerCase();

    // Hash the password before saving to DB
    const hashedPassword = await hashPassword(password);

    // Create a new user and save it to the database
    const user = await prisma.user.create({
      data: {
        name,
        email: modifiedEmail,
        password: hashedPassword,
      },
    });

    // Store JWT token in secure HTTP-only cookie for auth
    await StoreCookie(user.id);

    // Delete used OTP from DB to prevent reuse
    await prisma.otp.delete({
      where: { id: otpExist.id },
    });

    // Fetch newly created user for response (excluding password)
    const data = await prisma.user.findUnique({
      where: { email: modifiedEmail },
      omit: {
        password: true,
      },
    });

    return ResponseHandler(201, "User registered successfully!", data);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    const errMessage = formatError(error);
    return ErrorHandler(500, errMessage, err.stack);
  }
};
