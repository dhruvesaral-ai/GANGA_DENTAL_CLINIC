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
      .select("name isActive createdAt updatedAt")
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

    const { name, isActive } = await request.json();

    if (!name?.trim()) {
      return jsonError("name is required", 400);
    }

    const treatment = await TreatmentModel.create({
      name: name.trim(),
      ...(typeof isActive === "boolean" ? { isActive } : {}),
    });

    return jsonSuccess(treatment, 201);
  } catch {
    return jsonError("Failed to create treatment", 500);
  }
}
