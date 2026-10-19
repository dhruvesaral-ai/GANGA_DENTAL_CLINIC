import { connectDB } from "@/lib/db";
import { jsonError, jsonSuccess } from "@/lib/api";
import { EnquiryModel } from "@/models/EnquiryModel";
import { TreatmentModel } from "@/models/TreatmentModel";
import { UserModel } from "@/models/UserModel";
import {
  sendEnquiryConfirmationToPatient,
  sendNewEnquiryAlertToAdmins,
} from "@/lib/enquiry-emails";
import { getSiteSettings } from "@/lib/site-settings-server";
import { isValidEmail, normalizeEmail } from "@/lib/validate-email";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, phone, message, preferredTreatment, preferredDate } =
      await request.json();

    if (!name?.trim() || !phone?.trim() || !preferredTreatment || !preferredDate) {
      return jsonError(
        "name, phone, preferredTreatment, and preferredDate are required",
        400
      );
    }

    const rawEmail = typeof email === "string" ? email.trim() : "";
    const patientEmail = rawEmail ? normalizeEmail(rawEmail) : "";
    if (patientEmail && !isValidEmail(patientEmail)) {
      return jsonError("Please enter a valid email address", 400);
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

    const site = await getSiteSettings();
    const enquiryDetails = {
      companyName: site.companyName,
      patientName: name.trim(),
      patientEmail,
      phone: phone.trim(),
      treatmentName: treatment.name,
      preferredDate: parsedDate,
      message: message?.trim() ?? "",
    };

    if (patientEmail) {
      const patientMail = await sendEnquiryConfirmationToPatient(enquiryDetails);
      if (!patientMail.ok) {
        return jsonError(
          "We could not send a confirmation to this email. Please check the address and try again.",
          400,
          patientMail.error
        );
      }
    }

    const enquiry = await EnquiryModel.create({
      name: enquiryDetails.patientName,
      email: patientEmail,
      phone: enquiryDetails.phone,
      message: enquiryDetails.message,
      preferredTreatment: treatment._id,
      preferredDate: parsedDate,
    });

    const admins = await UserModel.find({ role: "admin" }).select("email").lean();
    const adminEmails = admins
      .map((admin) => admin.email?.trim().toLowerCase())
      .filter((value): value is string => Boolean(value));

    const adminMail = await sendNewEnquiryAlertToAdmins(adminEmails, enquiryDetails);
    if (!adminMail.ok) {
      console.error("Admin enquiry alert email failed:", adminMail.error);
    }

    return jsonSuccess(
      {
        id: enquiry._id,
        message: "Appointment booked successfully",
      },
      201
    );
  } catch (error) {
    console.error("POST /api/book-appointment:", error);
    return jsonError("Failed to book appointment", 500, error);
  }
}
