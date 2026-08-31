import { connectDB } from "@/lib/db";
import { jsonError, jsonSuccess } from "@/lib/api";
import { EnquiryModel } from "@/models/EnquiryModel";

export async function GET() {
  try {
    await connectDB();

    const appointments = await EnquiryModel.find()
      .populate("preferredTreatment", "name")
      .select("name phone message preferredDate enquiryDate status createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return jsonSuccess(appointments);
  } catch (error) {
    console.error("GET /api/appointments:", error);
    return jsonError("Failed to fetch appointments", 500);
  }
}
