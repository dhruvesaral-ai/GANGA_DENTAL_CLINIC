import { connectDB } from "@/lib/db";
import { jsonError, jsonSuccess } from "@/lib/api";
import { TreatmentModel } from "@/models/TreatmentModel";
import { deleteUploadedImage } from "@/lib/multer";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return jsonError("Invalid treatment id", 400);
    }

    const { name, isActive, imageUrl } = await request.json();

    if (!name?.trim()) {
      return jsonError("name is required", 400);
    }

    const existing = await TreatmentModel.findById(id).select("imageUrl").lean();

    if (!existing) {
      return jsonError("Treatment not found", 404);
    }

    const nextImageUrl =
      typeof imageUrl === "string" ? imageUrl.trim() || null : undefined;

    const treatment = await TreatmentModel.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        ...(typeof isActive === "boolean" ? { isActive } : {}),
        ...(nextImageUrl !== undefined ? { imageUrl: nextImageUrl } : {}),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!treatment) {
      return jsonError("Treatment not found", 404);
    }

    // Clean up the previous image file when it is replaced or removed.
    if (
      nextImageUrl !== undefined &&
      existing.imageUrl &&
      existing.imageUrl !== nextImageUrl &&
      existing.imageUrl.startsWith("/uploads/")
    ) {
      await deleteUploadedImage(existing.imageUrl);
    }

    return jsonSuccess(treatment);
  } catch (error) {
    console.error("PUT /api/treatments/[id]:", error);
    return jsonError("Failed to update treatment", 500, error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return jsonError("Invalid treatment id", 400);
    }

    const treatment = await TreatmentModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).lean();

    if (!treatment) {
      return jsonError("Treatment not found", 404);
    }

    return jsonSuccess({ message: "Treatment deactivated successfully" });
  } catch (error) {
    console.error("DELETE /api/treatments/[id]:", error);
    return jsonError("Failed to delete treatment", 500, error);
  }
}
