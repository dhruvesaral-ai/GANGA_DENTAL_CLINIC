import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { jsonError, jsonSuccess } from "@/lib/api";
import { GalleryModel } from "@/models/GalleryModel";
import { getSessionFromCookies } from "@/lib/auth";
import { deleteUploadedImage } from "@/lib/multer";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== "admin") {
      return jsonError("Unauthorized: Admin access required", 401);
    }

    const { id } = await context.params;
    const body = await request.json();

    await connectDB();

    const updates: Record<string, unknown> = {};
    if (typeof body.is_active === "boolean") {
      updates.is_active = body.is_active;
    }
    if (body.position && ["home-carousal", "gallery"].includes(body.position)) {
      updates.position = body.position;
    }

    const item = await GalleryModel.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (!item) {
      return jsonError("Gallery item not found", 404);
    }

    return jsonSuccess(item);
  } catch (error) {
    console.error("PATCH /api/gallery/[id]:", error);
    return jsonError("Failed to update gallery item", 500, error);
  }
}

export const PUT = PATCH;

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== "admin") {
      return jsonError("Unauthorized: Admin access required", 401);
    }

    const { id } = await context.params;
    await connectDB();

    const item = await GalleryModel.findByIdAndDelete(id).lean();
    if (!item) {
      return jsonError("Gallery item not found", 404);
    }

    // Try deleting the underlying image file if it's stored in /uploads
    if (item.img_url && typeof item.img_url === "string") {
      await deleteUploadedImage(item.img_url);
    }

    return jsonSuccess({ success: true, message: "Gallery item deleted" });
  } catch (error) {
    console.error("DELETE /api/gallery/[id]:", error);
    return jsonError("Failed to delete gallery item", 500, error);
  }
}
