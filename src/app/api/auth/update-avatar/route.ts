import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import ErrorHandler from "@/server/utils/ErrorHandler";
import { formatError } from "@/server/utils/errorMessage";
import ResponseHandler from "@/server/utils/ResponseHandler";
import UserId from "@/server/utils/UserId";
import { prisma } from "@/server/db/config";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function processFormData(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("avatar") as File;
  if (!file) {
    ErrorHandler(404, "File not found");
  }

  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `avatar-${Date.now()}-${file.name}`);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(tempFilePath, buffer);

  return {
    filepath: tempFilePath,
    originalFilename: file.name,
    mimetype: file.type,
    size: file.size,
  };
}

export async function PUT(req: NextRequest) {
  try {
    const fileData = await processFormData(req);

    const uploadDir = path.join(process.cwd(), "public", "avatar");

    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const originalFilename = fileData.originalFilename || "avatar";

    const uniqueFilename = `${Date.now()}-${originalFilename}`;
    const destinationPath = path.join(uploadDir, uniqueFilename);

    await fs.copyFile(fileData.filepath, destinationPath);
    await fs.unlink(fileData.filepath);
    const filePath = `/avatar/${uniqueFilename}`;

    const id = await UserId();

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return ErrorHandler(404, "User not found");
    }

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        avatar: filePath,
      },
    });

    return ResponseHandler(200, "Avatar Uploaded");
  } catch (error: unknown) {
    const err =
      error instanceof Error ? error : new Error("Failed to upload file");
    const errMessage = formatError(error);
    return ErrorHandler(500, errMessage, err.stack);
  }
}
