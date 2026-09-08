export const SITE_SETTING_KEYS = {
  COMPANY_NAME: "company_name",
  PHONE_NUMBER: "phone_number",
  WHATSAPP_NUMBER: "whatsapp_number",
  ADDRESS: "address",
} as const;

export type SiteSettings = {
  companyName: string;
  phoneNumber: string;
  whatsappNumber: string;
  address: string;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: "Ganga Dental Clinic",
  phoneNumber: "+919525989736",
  whatsappNumber: "+919525989736",
  address:
    "Road No:- 2, Dwarika Puri, House no:- 281, Hanuman Nagar, Kankarbagh, Patna, Bihar 800020",
};

export function normalizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function formatPhoneDisplay(phone: string): string {
  const digits = normalizePhoneDigits(phone);

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 8)} ${digits.slice(8)}`;
  }

  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 6)} ${digits.slice(6)}`;
  }

  return phone;
}

export function toTelLink(phone: string): string {
  const digits = normalizePhoneDigits(phone);
  return digits ? `tel:+${digits.startsWith("91") ? digits : `91${digits}`}` : "#";
}

export function toWhatsAppLink(phone: string, message?: string): string {
  const digits = normalizePhoneDigits(phone);
  if (!digits) return "#";

  const base = `https://wa.me/${digits}`;
  if (!message) return base;

  return `${base}?text=${encodeURIComponent(message)}`;
}
