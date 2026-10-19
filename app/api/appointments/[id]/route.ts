import { connectDB } from "@/lib/db";
import { jsonError, jsonSuccess } from "@/lib/api";
import { EnquiryModel } from "@/models/EnquiryModel";
import {
  sendAppointmentConfirmedToPatient,
} from "@/lib/enquiry-emails";
import { getSiteSettings } from "@/lib/site-settings-server";
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

    const existing = await EnquiryModel.findById(id)
      .populate({ path: "preferredTreatment", select: "name" })
      .lean();

    if (!existing) {
      return jsonError("Appointment not found", 404);
    }

    const previousStatus = existing.status ?? "pending";

    const appointment = await EnquiryModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate({ path: "preferredTreatment", select: "name" })
      .lean();

    if (!appointment) {
      return jsonError("Appointment not found", 404);
    }

    if (
      status === "confirmed" &&
      previousStatus !== "confirmed" &&
      appointment.email?.trim()
    ) {
      const site = await getSiteSettings();
      const treatment =
        appointment.preferredTreatment &&
        typeof appointment.preferredTreatment === "object" &&
        "name" in appointment.preferredTreatment
          ? String(appointment.preferredTreatment.name)
          : "Treatment";

      const mail = await sendAppointmentConfirmedToPatient({
        companyName: site.companyName,
        patientName: appointment.name,
        patientEmail: appointment.email.trim(),
        phone: appointment.phone,
        treatmentName: treatment,
        preferredDate: new Date(appointment.preferredDate),
        message: appointment.message ?? "",
      });

      if (!mail.ok) {
        console.error("Appointment confirmed email failed:", mail.error);
      }
    }

    return jsonSuccess({
      ...appointment,
      status: appointment.status ?? "pending",
    });
  } catch (error) {
    console.error("PUT /api/appointments/[id]:", error);
    return jsonError("Failed to update appointment", 500, error);
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
    return jsonError("Failed to delete appointment", 500, error);
  }
}
