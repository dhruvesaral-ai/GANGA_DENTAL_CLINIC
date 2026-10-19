import { sendEmail, type SendEmailResult } from "@/lib/email";

type EnquiryEmailDetails = {
  companyName: string;
  patientName: string;
  patientEmail: string;
  phone: string;
  treatmentName: string;
  preferredDate: Date;
  message: string;
};

function formatPreferredDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function sendEnquiryConfirmationToPatient(details: EnquiryEmailDetails) {
  const dateLabel = formatPreferredDate(details.preferredDate);

  const text = `Hi ${details.patientName},

Thank you for contacting ${details.companyName}. We received your appointment request.

Treatment: ${details.treatmentName}
Preferred date: ${dateLabel}
Phone: ${details.phone}
${details.message ? `\nYour message:\n${details.message}\n` : ""}
Our team will call you soon to confirm your slot. When your appointment is confirmed, we will email you again at this address.

— ${details.companyName}`;

  const html = `
    <p>Hi ${escapeHtml(details.patientName)},</p>
    <p>Thank you for contacting <strong>${escapeHtml(details.companyName)}</strong>. We received your appointment request.</p>
    <ul>
      <li><strong>Treatment:</strong> ${escapeHtml(details.treatmentName)}</li>
      <li><strong>Preferred date:</strong> ${escapeHtml(dateLabel)}</li>
      <li><strong>Phone:</strong> ${escapeHtml(details.phone)}</li>
    </ul>
    ${details.message ? `<p><strong>Your message:</strong><br/>${escapeHtml(details.message)}</p>` : ""}
    <p>Our team will call you soon to confirm your slot. When your appointment is confirmed, we will email you again at this address.</p>
    <p>— ${escapeHtml(details.companyName)}</p>
  `;

  return sendEmail({
    to: details.patientEmail,
    subject: `Appointment request received — ${details.companyName}`,
    html,
    text,
  });
}

export async function sendAppointmentConfirmedToPatient(
  details: EnquiryEmailDetails
): Promise<SendEmailResult> {
  if (!details.patientEmail.trim()) {
    return { ok: true, id: "skipped-no-email" };
  }

  const dateLabel = formatPreferredDate(details.preferredDate);

  const text = `Hi ${details.patientName},

Your appointment at ${details.companyName} has been confirmed.

Treatment: ${details.treatmentName}
Preferred date: ${dateLabel}
Phone: ${details.phone}

We look forward to seeing you. If you need to reschedule, please call us.

— ${details.companyName}`;

  const html = `
    <p>Hi ${escapeHtml(details.patientName)},</p>
    <p>Your appointment at <strong>${escapeHtml(details.companyName)}</strong> has been <strong>confirmed</strong>.</p>
    <ul>
      <li><strong>Treatment:</strong> ${escapeHtml(details.treatmentName)}</li>
      <li><strong>Preferred date:</strong> ${escapeHtml(dateLabel)}</li>
      <li><strong>Phone:</strong> ${escapeHtml(details.phone)}</li>
    </ul>
    <p>We look forward to seeing you. If you need to reschedule, please call us.</p>
    <p>— ${escapeHtml(details.companyName)}</p>
  `;

  return sendEmail({
    to: details.patientEmail,
    subject: `Appointment confirmed — ${details.companyName}`,
    html,
    text,
  });
}

export async function sendNewEnquiryAlertToAdmins(
  adminEmails: string[],
  details: EnquiryEmailDetails
): Promise<SendEmailResult> {
  if (adminEmails.length === 0) {
    return { ok: true, id: "skipped-no-admins" };
  }

  const dateLabel = formatPreferredDate(details.preferredDate);

  const text = `New enquiry on ${details.companyName}

Patient: ${details.patientName}
Email: ${details.patientEmail || "—"}
Phone: ${details.phone}
Treatment: ${details.treatmentName}
Preferred date: ${dateLabel}
${details.message ? `Message: ${details.message}` : ""}

Review it in the admin dashboard.`;

  const html = `
    <h2>New enquiry</h2>
    <p>A new appointment request was submitted on <strong>${escapeHtml(details.companyName)}</strong>.</p>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><strong>Patient</strong></td><td>${escapeHtml(details.patientName)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${details.patientEmail ? escapeHtml(details.patientEmail) : "—"}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${escapeHtml(details.phone)}</td></tr>
      <tr><td><strong>Treatment</strong></td><td>${escapeHtml(details.treatmentName)}</td></tr>
      <tr><td><strong>Preferred date</strong></td><td>${escapeHtml(dateLabel)}</td></tr>
    </table>
    ${details.message ? `<p><strong>Message:</strong><br/>${escapeHtml(details.message)}</p>` : ""}
    <p>Review it in the admin dashboard.</p>
  `;

  return sendEmail({
    to: adminEmails,
    subject: `New enquiry: ${details.patientName} — ${details.companyName}`,
    html,
    text,
    ...(details.patientEmail.trim() ? { replyTo: details.patientEmail } : {}),
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
