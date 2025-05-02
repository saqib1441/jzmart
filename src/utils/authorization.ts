import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

// Type for the payload you store in the token
export interface AuthTokenPayload extends JwtPayload {
  id: string;
}

// Sign a JWT token
export const signToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET!, {
    expiresIn: "30d",
  });
};

// Verify the JWT token
export const verifyToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, JWT_SECRET!) as AuthTokenPayload;
};

// Get user from token in cookies
export const isAuthorized = async (): Promise<AuthTokenPayload | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const decoded = verifyToken(token);
    return decoded;
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    console.log(errMessage);
    return null;
  }
};
