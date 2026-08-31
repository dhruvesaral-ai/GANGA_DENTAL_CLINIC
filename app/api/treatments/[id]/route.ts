import { connectDB } from "@/lib/db";
import { jsonError, jsonSuccess } from "@/lib/api";
import { TreatmentModel } from "@/models/TreatmentModel";
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

    const { name, description, price, image, isActive } = await request.json();

    if (!name?.trim() || !description?.trim() || price == null || !image?.trim()) {
      return jsonError("name, description, price, and image are required", 400);
    }

    if (typeof price !== "number" || price < 0) {
      return jsonError("price must be a non-negative number", 400);
    }

    const treatment = await TreatmentModel.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: description.trim(),
        price,
        image: image.trim(),
        ...(typeof isActive === "boolean" ? { isActive } : {}),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!treatment) {
      return jsonError("Treatment not found", 404);
    }

    return jsonSuccess(treatment);
  } catch {
    return jsonError("Failed to update treatment", 500);
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
  } catch {
    return jsonError("Failed to delete treatment", 500);
  }
}
