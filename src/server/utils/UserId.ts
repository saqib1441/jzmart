import { cookies } from "next/headers";
import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";
import ErrorHandler from "./ErrorHandler";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

interface JwtPayload extends DefaultJwtPayload {
  id: string;
}

const UserId = async () => {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    throw ErrorHandler(404, "Please login first to access this page!");
  }
  const decode = jwt.verify(token, JWT_SECRET) as JwtPayload;

  if (!decode.id) {
    throw ErrorHandler(401, "Invalid token: ID not found.");
  }

  return decode.id;
};

export default UserId;
