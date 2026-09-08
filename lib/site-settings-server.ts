import { getSettings } from "@/lib/settings";
import {
  DEFAULT_SITE_SETTINGS,
  SITE_SETTING_KEYS,
  type SiteSettings,
} from "@/lib/site";

function asString(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  return fallback;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await getSettings(Object.values(SITE_SETTING_KEYS));

  return {
    companyName: asString(
      settings[SITE_SETTING_KEYS.COMPANY_NAME],
      DEFAULT_SITE_SETTINGS.companyName
    ),
    phoneNumber: asString(
      settings[SITE_SETTING_KEYS.PHONE_NUMBER],
      DEFAULT_SITE_SETTINGS.phoneNumber
    ),
    whatsappNumber: asString(
      settings[SITE_SETTING_KEYS.WHATSAPP_NUMBER],
      DEFAULT_SITE_SETTINGS.whatsappNumber
    ),
    address: asString(settings[SITE_SETTING_KEYS.ADDRESS], DEFAULT_SITE_SETTINGS.address),
  };
}
