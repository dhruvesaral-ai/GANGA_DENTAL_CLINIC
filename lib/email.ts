import { Resend } from "resend";
import { errorMessage } from "@/lib/api";

export type SendEmailInput = {
  /** Sender; falls back to RESEND_FROM in .env when omitted */
  from?: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
};

export type SendEmailSuccess = {
  ok: true;
  id: string;
};

export type SendEmailFailure = {
  ok: false;
  error: string;
};

export type SendEmailResult = SendEmailSuccess | SendEmailFailure;

let resendClient: Resend | null = null;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set in environment variables");
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

function normalizeRecipients(value: string | string[]) {
  const list = Array.isArray(value) ? value : [value];
  return list.map((entry) => entry.trim()).filter(Boolean);
}

/**
 * Default "from" address when callers omit `from`.
 * Set RESEND_FROM in .env (e.g. `Ganga Dental <noreply@yourdomain.com>`).
 */
export function getDefaultFromAddress() {
  const from = process.env.RESEND_FROM?.trim();
  if (!from) {
    throw new Error("RESEND_FROM is not set and no from address was provided");
  }
  return from;
}

/**
 * Send an email via Resend.
 * Requires RESEND_API_KEY. Provide `from` or set RESEND_FROM in .env.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const from = input.from?.trim() || getDefaultFromAddress();
  const to = normalizeRecipients(input.to);
  const subject = input.subject?.trim();

  if (!subject) {
    return { ok: false, error: "subject is required" };
  }
  if (to.length === 0) {
    return { ok: false, error: "at least one to recipient is required" };
  }
  if (!input.html?.trim() && !input.text?.trim()) {
    return { ok: false, error: "html or text body is required" };
  }

  try {
    const resend = getResendClient();

    const base = {
      from,
      to,
      subject,
      ...(input.replyTo && { replyTo: normalizeRecipients(input.replyTo) }),
      ...(input.cc && { cc: normalizeRecipients(input.cc) }),
      ...(input.bcc && { bcc: normalizeRecipients(input.bcc) }),
    };

    const payload = input.html?.trim()
      ? { ...base, html: input.html }
      : { ...base, text: input.text! };

    const { data, error } = await resend.emails.send(payload);

    if (error) {
      return { ok: false, error: error.message };
    }
    if (!data?.id) {
      return { ok: false, error: "Resend did not return a message id" };
    }

    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: errorMessage(err) };
  }
}
