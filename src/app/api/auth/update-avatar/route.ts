import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/db/config";
import { formatError } from "@/utils/errorMessage";
import ErrorHandler from "@/utils/ErrorHandler";
import ResponseHandler from "@/utils/ResponseHandler";
import { isAuthorized } from "@/utils/authorization";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Extracts public ID from Cloudinary URL
const extractPublicId = (url: string): string | null => {
  if (!url || !url.includes("cloudinary")) return null;

  const matches = url.match(/\/v\d+\/([^/]+)\/([^/.]+)/);
  return matches ? `${matches[1]}/${matches[2]}` : null;
};

// Uploads file to Cloudinary
const uploadToCloudinary = async (
  file: File,
  userId: string
): Promise<string> => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const dataURI = `data:${file.type};base64,${buffer.toString("base64")}`;
  const publicId = `avatar_${userId}_${Date.now()}`;

  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload(
      dataURI,
      {
        folder: "avatars",
        public_id: publicId,
        resource_type: "auto",
        transformation: [
          { width: 400, height: 400, crop: "limit" },
          { quality: "auto" },
        ],
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
  });

  return result.secure_url;
};

export const PUT = async (req: NextRequest) => {
  try {
    const isLoggedIn = await isAuthorized();
    if (!isLoggedIn)
      return ErrorHandler(401, "Please login first to update avatar");

    const user = await prisma.user.findUnique({ where: { id: isLoggedIn.id } });
    if (!user) return ErrorHandler(404, "User not found");

    const formData = await req.formData();
    const file = formData.get("avatar") as File;
    if (!file) return ErrorHandler(404, "File not found");

    // Upload new avatar
    const newAvatarUrl = await uploadToCloudinary(file, isLoggedIn.id);

    // Update user record
    await prisma.user.update({
      where: { id: isLoggedIn.id },
      data: { avatar: newAvatarUrl },
    });

    // Delete old avatar if exists
    if (user.avatar) {
      const publicId = extractPublicId(user.avatar);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (error: unknown) {
          const errMessage = formatError(error);
          const err =
            error instanceof Error ? error : new Error("Failed to upload file");
          return ErrorHandler(500, errMessage, err.stack);
        }
      }
    }

    return ResponseHandler(200, "Avatar Uploaded Successfully");
  } catch (error: unknown) {
    const errMessage = formatError(error);
    const err =
      error instanceof Error ? error : new Error("Failed to upload file");
    console.error("Avatar upload error:", err);
    return ErrorHandler(500, errMessage, err.stack);
  }
};
