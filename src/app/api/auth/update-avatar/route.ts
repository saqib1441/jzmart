import { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/server/db/config";
import UserId from "@/server/utils/UserId";
import { formatError } from "@/server/utils/errorMessage";
import ErrorHandler from "@/server/utils/ErrorHandler";
import ResponseHandler from "@/server/utils/ResponseHandler";

export async function PUT(req: NextRequest) {
  try {
    // Get the current user ID
    const id = await UserId();
    if (!id) {
      return ErrorHandler(401, "Unauthorized");
    }

    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return ErrorHandler(404, "User not found");
    }

    // Process the uploaded file
    const formData = await req.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return ErrorHandler(404, "File not found");
    }

    // Generate a unique filename
    const originalFilename = file.name || "avatar";
    const uniqueFilename = `${Date.now()}-${originalFilename}`;

    // Upload to Vercel Blob Storage
    const blob = await put(`avatars/${uniqueFilename}`, file, {
      access: "public",
      contentType: file.type,
    });

    // Use the URL returned by Vercel Blob
    const filePath = blob.url;

    // Update the user record in the database
    await prisma.user.update({
      where: { id },
      data: { avatar: filePath },
    });

    return ResponseHandler(200, "Avatar Uploaded", { avatar: filePath });
  } catch (error: unknown) {
    const err =
      error instanceof Error ? error : new Error("Failed to upload file");
    const errMessage = formatError(error);
    return ErrorHandler(500, errMessage, err.stack);
  }
}
