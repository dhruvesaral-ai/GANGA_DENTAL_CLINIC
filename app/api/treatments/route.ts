import { connectDB } from "@/lib/db";
import { jsonError, jsonSuccess } from "@/lib/api";
import { TreatmentModel } from "@/models/TreatmentModel";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const showAll = request.nextUrl.searchParams.get("all") === "true";
    const filter = showAll ? {} : { isActive: true };

    const treatments = await TreatmentModel.find(filter)
      .select("name description price image isActive createdAt updatedAt")
      .sort({ name: 1 })
      .lean();

    return jsonSuccess(treatments);
  } catch {
    return jsonError("Failed to fetch treatments", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, description, price, image } = await request.json();

    if (!name?.trim() || !description?.trim() || price == null || !image?.trim()) {
      return jsonError("name, description, price, and image are required", 400);
    }

    if (typeof price !== "number" || price < 0) {
      return jsonError("price must be a non-negative number", 400);
    }

    const treatment = await TreatmentModel.create({
      name: name.trim(),
      description: description.trim(),
      price,
      image: image.trim(),
    });

    return jsonSuccess(treatment, 201);
  } catch {
    return jsonError("Failed to create treatment", 500);
  }
}
