import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientValidationError,
} from "@/generated/prisma/runtime/library";

export function formatError(error: unknown): string {
  // Handle known Prisma client errors
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2000":
        return "The provided value is too long for one of the fields.";
      case "P2002":
        return "This value already exists. Please use a different one.";
      case "P2003":
        return "Invalid foreign key value.";
      case "P2025":
        return "The record you are trying to update or delete does not exist.";
      default:
        return `Database error occurred. (Code: ${error.code})`;
    }
  }

  // Handle Prisma initialization errors
  if (error instanceof PrismaClientInitializationError) {
    return "Failed to connect to the database. Please try again later.";
  }

  // Handle Prisma validation errors
  if (error instanceof PrismaClientValidationError) {
    return "Invalid data input. Please check your form.";
  }

  // Handle Prisma Rust panic or unknown internal errors
  if (error instanceof PrismaClientRustPanicError) {
    return "Something went wrong on the server. Please try again.";
  }

  // Type guard for objects with a `message` string property
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    const msg = (error as { message: string }).message;
    if (msg.includes("ECONNREFUSED")) {
      return "Database connection failed. Please ensure the server is running.";
    }
    if (msg.includes("Can't reach database server")) {
      return "Unable to reach the database. Check your connection settings.";
    }
    return msg;
  }

  // Fallback for unknown errors
  return "An unexpected error occurred. Please try again later.";
}
