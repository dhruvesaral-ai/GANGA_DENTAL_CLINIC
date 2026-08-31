import { connectDB } from "@/lib/db";
import { jsonError, jsonSuccess } from "@/lib/api";
import { EnquiryModel } from "@/models/EnquiryModel";
import { TreatmentModel } from "@/models/TreatmentModel";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, phone, message, preferredTreatment, preferredDate } =
      await request.json();

    if (!name?.trim() || !phone?.trim() || !preferredTreatment || !preferredDate) {
      return jsonError(
        "name, phone, preferredTreatment, and preferredDate are required",
        400
      );
    }

    if (!mongoose.Types.ObjectId.isValid(preferredTreatment)) {
      return jsonError("preferredTreatment must be a valid treatment id", 400);
    }

    const parsedDate = new Date(preferredDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return jsonError("preferredDate must be a valid date", 400);
    }

    const treatment = await TreatmentModel.findById(preferredTreatment);
    if (!treatment || !treatment.isActive) {
      return jsonError("Treatment not found", 404);
    }

    const enquiry = await EnquiryModel.create({
      name: name.trim(),
      phone: phone.trim(),
      message: message?.trim() ?? "",
      preferredTreatment: treatment._id,
      preferredDate: parsedDate,
    });

    return jsonSuccess(
      {
        id: enquiry._id,
        message: "Appointment booked successfully",
      },
      201
    );
  } catch {
    return jsonError("Failed to book appointment", 500);
  }
}
