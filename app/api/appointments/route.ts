import { connectDB } from "@/lib/db";
import { jsonError, jsonSuccess } from "@/lib/api";
import { EnquiryModel } from "@/models/EnquiryModel";

export async function GET() {
  try {
    await connectDB();

    const appointments = await EnquiryModel.find()
      .sort({ createdAt: -1 })
      .populate({ path: "preferredTreatment", select: "name" })
      .lean();

    const normalized = appointments.map((appointment) => ({
      ...appointment,
      status: appointment.status ?? "pending",
    }));

    return jsonSuccess(normalized);
  } catch (error) {
    console.error("GET /api/appointments:", error);
    return jsonError("Failed to fetch appointments", 500);
  }
}
