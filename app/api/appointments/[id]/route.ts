import { connectDB } from "@/lib/db";
import { jsonError, jsonSuccess } from "@/lib/api";
import { EnquiryModel } from "@/models/EnquiryModel";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

const validStatuses = ["pending", "confirmed", "cancelled"] as const;

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return jsonError("Invalid appointment id", 400);
    }

    const { status } = await request.json();

    if (!validStatuses.includes(status)) {
      return jsonError("status must be pending, confirmed, or cancelled", 400);
    }

    const appointment = await EnquiryModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("preferredTreatment", "name")
      .lean();

    if (!appointment) {
      return jsonError("Appointment not found", 404);
    }

    return jsonSuccess(appointment);
  } catch (error) {
    console.error("PUT /api/appointments/[id]:", error);
    return jsonError("Failed to update appointment", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return jsonError("Invalid appointment id", 400);
    }

    const appointment = await EnquiryModel.findByIdAndDelete(id).lean();

    if (!appointment) {
      return jsonError("Appointment not found", 404);
    }

    return jsonSuccess({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/appointments/[id]:", error);
    return jsonError("Failed to delete appointment", 500);
  }
}
