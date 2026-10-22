import { NextRequest } from "next/server";
import { jsonError, jsonSuccess } from "@/lib/api";
import { uploadImage, deleteUploadedImage } from "@/lib/multer";
import { getSessionFromCookies } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== "admin") {
      return jsonError("Unauthorized: Admin access required", 401);
    }

    const subFolder = request.nextUrl.searchParams.get("folder") || "";
    const result = await uploadImage(request, {
      subFolder,
      maxSizeInBytes: 5 * 1024 * 1024, // 5MB
    });

    return jsonSuccess(result, 201);
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return jsonError(
      error instanceof Error ? error.message : "Image upload failed",
      400,
      error
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== "admin") {
      return jsonError("Unauthorized: Admin access required", 401);
    }

    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return jsonError("Valid image url is required", 400);
    }

    const deleted = await deleteUploadedImage(url);
    if (!deleted) {
      return jsonError("File not found or could not be deleted", 404);
    }

    return jsonSuccess({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/upload error:", error);
    return jsonError("Failed to delete image", 500, error);
  }
}
