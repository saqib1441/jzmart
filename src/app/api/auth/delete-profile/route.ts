import { prisma } from "@/server/db/config";
import ErrorHandler from "@/server/utils/ErrorHandler";
import { formatError } from "@/server/utils/errorMessage";
import ResponseHandler from "@/server/utils/ResponseHandler";
import UserId from "@/server/utils/UserId";
import { cookies } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary first before using it
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Extracts public ID from Cloudinary URL
const extractPublicId = (url: string): string | null => {
  if (!url || !url.includes("cloudinary")) return null;

  // Updated regex to better handle typical Cloudinary URLs
  const matches = url.match(/\/v\d+\/([^/]+)\/([^/.]+)/);
  return matches ? `${matches[1]}/${matches[2]}` : null;
};

export const DELETE = async () => {
  try {
    const id = await UserId();

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return ErrorHandler(404, "User not found");
    }

    // Delete avatar from Cloudinary if exists
    if (user.avatar) {
      const publicId = extractPublicId(user.avatar);
      if (publicId) {
        try {
          const result = await cloudinary.uploader.destroy(publicId);

          // Log result for debugging if needed
          console.log("Cloudinary delete result:", result);

          if (result.result !== "ok") {
            console.warn(
              `Cloudinary deletion warning for ${publicId}: ${result.result}`
            );
          }
        } catch (error: unknown) {
          const errMessage = formatError(error);
          const err =
            error instanceof Error ? error : new Error("Unknown error");
          return ErrorHandler(500, errMessage, err.stack);
        }
      }
    }

    // Delete user from database
    await prisma.user.delete({
      where: { id },
    });

    const cookie = await cookies();
    cookie.delete("token");

    return ResponseHandler(200, "Account deleted successfully!");
  } catch (error: unknown) {
    const errMessage = formatError(error);
    const err = error instanceof Error ? error : new Error("Unknown error");
    return ErrorHandler(500, errMessage, err.stack);
  }
};
