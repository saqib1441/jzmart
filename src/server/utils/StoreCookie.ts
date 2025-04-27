import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

const StoreCookie = async (id: string) => {
  const cookieStore = await cookies();

  const token = jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "30d",
  });

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
};

export default StoreCookie;
